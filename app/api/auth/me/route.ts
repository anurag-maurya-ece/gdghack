import { NextRequest } from "next/server";
import { requireAuth, apiSuccess, apiError, AuthContextError } from "@/server/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    const ctx = await requireAuth(request);
    return apiSuccess({ user: ctx.user });
  } catch (error: any) {
    if (error instanceof AuthContextError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve current user");
  }
}
