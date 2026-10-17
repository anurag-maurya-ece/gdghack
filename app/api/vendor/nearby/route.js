import { NextResponse } from "next/server";
import { INITIAL_VENDORS } from "../../../../lib/mock-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("latitude") || "28.6304");
  const lng = parseFloat(searchParams.get("longitude") || "77.2177");
  const radius = parseInt(searchParams.get("radius") || "2000");

  // In production / demo, return active nearby vendors
  const nearbyVendors = INITIAL_VENDORS.map((v) => ({
    _id: v.id,
    firstName: v.name,
    shopName: v.shopName,
    phone: v.phone || "9876543210",
    category: v.category,
    rating: v.rating,
    distance: v.distance,
    inventory: v.inventory.map((i) => ({
      item: i.name,
      price: i.price,
      quantity: 10,
      unit: i.unit,
    })),
    location: v.location,
    isActive: true,
  }));

  return NextResponse.json({
    success: true,
    count: nearbyVendors.length,
    vendors: nearbyVendors,
  });
}
