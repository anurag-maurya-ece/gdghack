import { NextResponse } from "next/server";
import { INITIAL_VENDORS } from "../../../lib/mock-data";

// In-memory demo vendor store
let vendorStore = [...INITIAL_VENDORS];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const phone = searchParams.get("phone");

  if (id || phone) {
    const vendor = vendorStore.find(
      (v) => (id && v.id === id) || (phone && v.phone === phone)
    );
    if (vendor) {
      return NextResponse.json({ success: true, vendor });
    }
    return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, vendors: vendorStore });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, inventory, isActive, name, shopName } = body;

    let vendor = vendorStore.find((v) => v.phone === phone);
    if (vendor) {
      if (inventory) vendor.inventory = inventory;
      if (isActive !== undefined) vendor.isActive = isActive;
      if (name) vendor.name = name;
      if (shopName) vendor.shopName = shopName;
    } else {
      vendor = {
        id: `vendor-${Date.now()}`,
        phone: phone || "9876543210",
        name: name || "Ramesh Bhaiya",
        shopName: shopName || "Apna Sabzi Thela",
        category: "Sabzi",
        isActive: isActive !== undefined ? isActive : true,
        inventory: inventory || [],
        rating: 4.8,
        reviewsCount: 52,
        location: { lat: 28.6304, lng: 77.2177 },
      };
      vendorStore.push(vendor);
    }

    return NextResponse.json({ success: true, vendor });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
