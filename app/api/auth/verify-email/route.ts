export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { AuthService, AuthError } from "@/server/auth/service";
import { apiSuccess, apiError } from "@/server/auth/rbac";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body?.token;

    if (!token || typeof token !== "string") {
      return apiError(400, "TOKEN_REQUIRED", "Verification token is required");
    }

    const result = await AuthService.verifyEmail(token);
    return apiSuccess(result);
  } catch (error: any) {
    if (error instanceof AuthError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", "Failed to verify email");
  }
}
