export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { DemandService } from "@/server/services/demand.service";
import { prisma } from "@/server/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { consumerId, item, quantity, notes, latitude, longitude } = body;

    // Ensure consumer User exists in database
    const customerUser = await prisma.user.upsert({
      where: { id: consumerId || "cust-default" },
      update: {},
      create: {
        id: consumerId || "cust-default",
        email: `customer_${Date.now()}@thela.local`,
        phone: `+91980000${Math.floor(1000 + Math.random() * 9000)}`,
        name: "Valued Customer",
        passwordHash: "$dummy_hash$",
        role: "CUSTOMER",
      },
    });

    const ping = await DemandService.recordDemandPing({
      userId: customerUser.id,
      latitude: Number(latitude || 28.6304),
      longitude: Number(longitude || 77.2177),
      item: item || "Fresh Produce",
      quantity: quantity || "1 kg",
      notes: notes || "Doorstep delivery",
    });

    return NextResponse.json({
      success: true,
      message: "Demand ping broadcasted to nearby vendors",
      pingId: ping.id,
      ping: {
        pingId: ping.id,
        consumerId: ping.customerId,
        item: ping.itemRequested,
        quantity: ping.approxQuantity,
        notes: ping.landmark,
        location: {
          lat: latitude || 28.6304,
          lng: longitude || 77.2177,
        },
        status: ping.status.toLowerCase(),
        createdAt: ping.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
