import { NextRequest } from "next/server";
import { DemandService } from "@/server/services/demand.service";
import { apiSuccess, apiError } from "@/server/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    const zones = await DemandService.getSuggestedZones(category);
    return apiSuccess({ zones });
  } catch (error: any) {
    return apiError(500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
