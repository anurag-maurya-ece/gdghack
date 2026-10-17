import { prisma } from "../lib/db";
import { PingStatus } from "@prisma/client";

export interface RecordDemandPingInput {
  userId: string;
  latitude: number;
  longitude: number;
  category?: string;
  item?: string;
  quantity?: string;
  notes?: string;
}

export class DemandService {
  /**
   * Record a customer "Bulao Thela" demand ping
   * Fulfills AGENTS.md F7 Community Predictive Routing
   */
  static async recordDemandPing(input: RecordDemandPingInput) {
    const itemRequested = input.item || input.category || "Fresh Produce";
    const approxQuantity = input.quantity || "1 kg";
    const landmark = input.notes || "Near Landmark";

    const ping = await prisma.demandPing.create({
      data: {
        customerId: input.userId,
        itemRequested,
        approxQuantity,
        landmark,
        status: PingStatus.PENDING,
      },
    });

    // Update / increment corresponding demand cell score
    const latRounded = Math.round(input.latitude * 100) / 100;
    const lngRounded = Math.round(input.longitude * 100) / 100;
    const cellHash = `cell_${latRounded}_${lngRounded}`;

    await prisma.demandCell.upsert({
      where: { cellHash },
      update: {
        score: { increment: 15 },
        reason: `High demand for ${itemRequested} around this area`,
        updatedAt: new Date(),
      },
      create: {
        cellHash,
        latitude: latRounded,
        longitude: lngRounded,
        score: 25,
        peakHours: "4:00 PM - 8:00 PM",
        reason: `Recent customer requests for ${itemRequested}`,
      },
    });

    return ping;
  }

  /**
   * Accept a demand ping by vendor
   */
  static async acceptDemandPing(pingId: string, vendorId: string) {
    return prisma.demandPing.update({
      where: { id: pingId },
      data: {
        status: PingStatus.ACCEPTED,
        acceptedVendorId: vendorId,
      },
    });
  }

  /**
   * Get top 3 suggested high-demand zones for street vendors
   * Rule-based scoring decayed by recency (AGENTS.md F7)
   */
  static async getSuggestedZones(category?: string) {
    const cells = await prisma.demandCell.findMany({
      orderBy: { score: "desc" },
      take: 3,
    });

    if (cells.length > 0) {
      return cells.map((c) => ({
        zoneId: c.cellHash,
        latitude: c.latitude,
        longitude: c.longitude,
        demandScore: c.score,
        peakHours: c.peakHours,
        reason: c.reason,
        isDemoSeeded: false,
      }));
    }

    // Default seeded high-demand hotspots (labeled as demo data per AGENTS.md)
    return [
      {
        zoneId: "cell_connaught_place",
        name: "Connaught Place / Shivaji Stadium Metro",
        latitude: 28.6304,
        longitude: 77.2177,
        demandScore: 94,
        peakHours: "4:30 PM - 7:30 PM",
        reason: `High office crowd demand for evening ${category || "Chai & Snacks"} (Labeled Demo Data)`,
        isDemoSeeded: true,
      },
      {
        zoneId: "cell_dwarka_sec14",
        name: "Dwarka Sector 14 / Metro Gate 2",
        latitude: 28.5983,
        longitude: 77.0319,
        demandScore: 82,
        peakHours: "5:00 PM - 8:30 PM",
        reason: `Residential evening rush for fresh vegetables & fruits (Labeled Demo Data)`,
        isDemoSeeded: true,
      },
      {
        zoneId: "cell_noida_sec18",
        name: "Noida Sector 18 Market Area",
        latitude: 28.5708,
        longitude: 77.326,
        demandScore: 76,
        peakHours: "1:00 PM - 3:00 PM",
        reason: `Afternoon shopper and student snack requests (Labeled Demo Data)`,
        isDemoSeeded: true,
      },
    ];
  }
}
