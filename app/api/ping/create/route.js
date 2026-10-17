import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { consumerId, item, quantity, notes, latitude, longitude } = body;

    const ping = {
      pingId: `ping-${Date.now()}`,
      consumerId: consumerId || "cust-007",
      item: item || "Fresh Produce",
      quantity: quantity || "1 kg",
      notes: notes || "Doorstep delivery",
      location: {
        lat: latitude || 28.6304,
        lng: longitude || 77.2177,
      },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Demand ping broadcasted to nearby vendors",
      pingId: ping.pingId,
      ping,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
