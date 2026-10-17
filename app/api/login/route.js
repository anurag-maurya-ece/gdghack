export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    // Validate input
    if (!phone || !password) {
      return NextResponse.json({ success: false, error: "Phone and password required" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor login successful",
      vendor: {
        phone,
        name: "Ramesh Bhaiya",
        shopName: "Ramesh Sabzi Thela",
        area: "Dwarka Sector 14 / Connaught Place Area",
        isActive: true,
        role: "vendor",
      },
      token: `vendor-session-${Date.now()}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
