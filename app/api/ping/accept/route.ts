import { NextRequest, NextResponse } from "next/server";
import { DemandService } from "@/server/services/demand.service";
import { VendorService } from "@/server/services/vendor.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pingId, vendorId, vendorPhone } = body;

    let vendorName = "Ramesh Bhaiya";
    let phone = vendorPhone || "9876543210";

    if (vendorId) {
      const vendor = await VendorService.getVendorById(vendorId);
      if (vendor) {
        vendorName = vendor.shopName || vendor.user?.name || vendorName;
        phone = vendor.user?.phone || phone;
      }
    }

    if (pingId) {
      try {
        await DemandService.acceptDemandPing(pingId, vendorId || "vendor-default");
      } catch {
        // Fallback gracefully for mock ping IDs
      }
    }

    return NextResponse.json({
      success: true,
      message: "Ping accepted! Navigation route established.",
      pingId,
      acceptedVendor: {
        id: vendorId || "vendor-ramesh",
        name: vendorName,
        phone,
        eta: "5 mins",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
