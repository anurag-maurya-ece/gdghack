import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, isActive, latitude, longitude } = body;

    return NextResponse.json({
      success: true,
      message: isActive ? "Vendor is now ONLINE & live tracking active" : "Vendor is now OFFLINE",
      vendor: {
        phone: phone || "9876543210",
        isActive: !!isActive,
        location: {
          lat: latitude || 28.6304,
          lng: longitude || 77.2177,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
