export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { LocationService } from "@/server/services/location.service";
import { VendorService } from "@/server/services/vendor.service";
import { prisma } from "@/server/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, isActive, latitude, longitude, vendorId } = body;

    let targetVendorId = vendorId;

    if (!targetVendorId && phone) {
      const vendor = await VendorService.getVendorByPhone(phone);
      if (vendor) {
        targetVendorId = vendor.id;
      } else {
        // Create vendor profile if not yet created
        const user = await prisma.user.upsert({
          where: { phone },
          update: {},
          create: {
            phone,
            email: `${phone.replace(/\D/g, "")}@thela.local`,
            name: "Vendor Partner",
            passwordHash: "$dummy_hash_for_vendor$",
            role: "VENDOR",
          },
        });

        const newVendor = await VendorService.createOrUpdateVendor({
          userId: user.id,
          shopName: "Apna Thela",
          category: "Vegetables",
          isActive: isActive !== undefined ? !!isActive : true,
        });
        targetVendorId = newVendor.id;
      }
    }

    if (targetVendorId && latitude && longitude) {
      await LocationService.updateLocation(targetVendorId, {
        latitude: Number(latitude),
        longitude: Number(longitude),
        isOnline: isActive !== undefined ? !!isActive : true,
      });
    }

    return NextResponse.json({
      success: true,
      message: isActive ? "Vendor is now ONLINE & live tracking active" : "Vendor is now OFFLINE",
      vendor: {
        id: targetVendorId,
        phone: phone || "9876543210",
        isActive: !!isActive,
        location: {
          lat: latitude || 28.6304,
          lng: longitude || 77.2177,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
