import { prisma } from "../lib/db";

export interface UpdateLocationInput {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  isOnline?: boolean;
}

export class LocationService {
  /**
   * Update or initialize vendor GPS location and synchronize vendor online status
   */
  static async updateLocation(vendorId: string, input: UpdateLocationInput) {
    const isOnline = input.isOnline !== undefined ? input.isOnline : true;

    const [location] = await prisma.$transaction([
      prisma.location.upsert({
        where: { vendorId },
        update: {
          latitude: input.latitude,
          longitude: input.longitude,
          updatedAt: new Date(),
        },
        create: {
          vendorId,
          latitude: input.latitude,
          longitude: input.longitude,
        },
      }),
      prisma.vendor.update({
        where: { id: vendorId },
        data: { isOnline },
      }),
    ]);

    return {
      ...location,
      isOnline,
    };
  }

  /**
   * Automatic background decay: mark vendors OFFLINE if no GPS ping received for timeoutMinutes
   * Enforces AGENTS.md Hard Constraint: "Mark the vendor offline if no update for N minutes"
   */
  static async decayStaleLocations(timeoutMinutes = 15): Promise<number> {
    const cutoffTime = new Date(Date.now() - timeoutMinutes * 60 * 1000);

    // Find all stale locations whose vendor is currently marked online
    const staleLocations = await prisma.location.findMany({
      where: {
        updatedAt: { lt: cutoffTime },
        vendor: { isOnline: true },
      },
      select: { vendorId: true },
    });

    if (staleLocations.length === 0) {
      return 0;
    }

    const vendorIds = staleLocations.map((l) => l.vendorId);

    const updateResult = await prisma.vendor.updateMany({
      where: {
        id: { in: vendorIds },
      },
      data: {
        isOnline: false,
      },
    });

    return updateResult.count;
  }
}
