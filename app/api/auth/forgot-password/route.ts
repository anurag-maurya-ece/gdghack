export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { AuthService, AuthError } from "@/server/auth/service";
import { apiSuccess, apiError } from "@/server/auth/rbac";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!email || typeof email !== "string") {
      return apiError(400, "EMAIL_REQUIRED", "Email address is required");
    }

    const result = await AuthService.forgotPassword(email);
    return apiSuccess({ message: result.message });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", "Failed to initiate password reset");
  }
}
