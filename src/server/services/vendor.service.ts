import { prisma } from "../lib/db";
import { Vendor, Location, Product, User } from "@prisma/client";

export interface CreateVendorInput {
  userId: string;
  shopName: string;
  shopType?: string;
  category?: string;
  bio?: string;
  isActive?: boolean;
}

export interface NearbyQueryInput {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}

export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export class VendorService {
  /**
   * Create or update vendor profile linked to a User
   */
  static async createOrUpdateVendor(input: CreateVendorInput) {
    const shopType = input.shopType || input.category || "Vegetables";
    const isOnline = input.isActive !== undefined ? input.isActive : true;

    return prisma.vendor.upsert({
      where: { userId: input.userId },
      update: {
        shopName: input.shopName,
        shopType,
        isOnline,
      },
      create: {
        userId: input.userId,
        shopName: input.shopName,
        shopType,
        isOnline,
      },
      include: {
        location: true,
        products: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get vendor by ID including location and product catalog
   */
  static async getVendorById(id: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        location: true,
        products: {
          where: { inStock: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!vendor) return null;
    return {
      ...vendor,
      phone: vendor.user.phone,
    };
  }

  /**
   * Get vendor by Phone number
   */
  static async getVendorByPhone(phone: string) {
    const user = await prisma.user.findFirst({
      where: { phone },
      include: {
        vendor: {
          include: {
            location: true,
            products: true,
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.vendor) return null;
    return {
      ...user.vendor,
      phone: user.phone,
    };
  }

  /**
   * List nearby vendors filtered by isOnline: true and sorted by Haversine distance
   */
  static async listNearbyVendors(input: NearbyQueryInput) {
    const radius = input.radiusMeters || 5000;

    // Retrieve vendors that are online and have a registered location
    const activeVendors = await prisma.vendor.findMany({
      where: {
        isOnline: true,
        location: {
          isNot: null,
        },
      },
      include: {
        location: true,
        products: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    const nearbyWithDistance = activeVendors
      .map((vendor) => {
        if (!vendor.location) return null;
        const distanceMeters = calculateHaversineDistanceMeters(
          input.latitude,
          input.longitude,
          vendor.location.latitude,
          vendor.location.longitude
        );

        return {
          ...vendor,
          distanceMeters: Math.round(distanceMeters),
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null && v.distanceMeters <= radius)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    return nearbyWithDistance;
  }

  /**
   * Toggle vendor online status
   */
  static async toggleOnlineStatus(vendorId: string, isOnline: boolean) {
    return prisma.vendor.update({
      where: { id: vendorId },
      data: { isOnline },
    });
  }
}
