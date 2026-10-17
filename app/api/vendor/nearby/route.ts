import { NextRequest, NextResponse } from "next/server";
import { VendorService } from "@/server/services/vendor.service";
import { INITIAL_VENDORS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("latitude") || "28.6304");
    const lng = parseFloat(searchParams.get("longitude") || "77.2177");
    const radius = parseInt(searchParams.get("radius") || "5000");

    const nearbyVendors = await VendorService.listNearbyVendors({
      latitude: lat,
      longitude: lng,
      radiusMeters: radius,
    });

    // If database has active vendors nearby, return them
    if (nearbyVendors.length > 0) {
      const formatted = nearbyVendors.map((v) => ({
        _id: v.id,
        id: v.id,
        firstName: v.user?.name || v.shopName,
        shopName: v.shopName,
        phone: v.user?.phone || "9876543210",
        category: v.shopType,
        rating: v.rating,
        distance: `${(v.distanceMeters / 1000).toFixed(1)} km`,
        distanceMeters: v.distanceMeters,
        inventory: v.products.map((p) => ({
          item: p.name,
          name: p.name,
          price: p.price,
          quantity: 10,
          unit: p.unit,
        })),
        location: {
          lat: v.location?.latitude || 28.6304,
          lng: v.location?.longitude || 77.2177,
        },
        isActive: v.isOnline,
      }));

      return NextResponse.json({
        success: true,
        count: formatted.length,
        vendors: formatted,
      });
    }

    // Demo fallback with INITIAL_VENDORS
    return NextResponse.json({
      success: true,
      count: INITIAL_VENDORS.length,
      vendors: INITIAL_VENDORS.map((v) => ({
        _id: v.id,
        id: v.id,
        firstName: v.name,
        shopName: v.shopName,
        phone: v.phone || "9876543210",
        category: v.category,
        rating: v.rating,
        distance: `${(v.distanceMeters / 1000).toFixed(1)} km`,
        distanceMeters: v.distanceMeters,
        inventory: v.inventory.map((i) => ({
          item: i.name,
          name: i.name,
          price: i.price,
          quantity: 10,
          unit: i.unit,
        })),
        location: { lat: v.lat, lng: v.lng },
        isActive: v.isOnline,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
