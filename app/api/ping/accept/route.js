import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { pingId, vendorId, vendorPhone } = body;

    return NextResponse.json({
      success: true,
      message: "Ping accepted! Navigation route established.",
      pingId,
      acceptedVendor: {
        id: vendorId || "vendor-ramesh",
        name: "Ramesh Bhaiya",
        phone: vendorPhone || "9876543210",
        eta: "5 mins",
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
