export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { AuthService, AuthError } from "@/server/auth/service";
import { apiSuccess, apiError } from "@/server/auth/rbac";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body || {};

    if (!token || typeof token !== "string") {
      return apiError(400, "TOKEN_REQUIRED", "Reset token is required");
    }
    if (!newPassword || typeof newPassword !== "string") {
      return apiError(400, "PASSWORD_REQUIRED", "New password is required");
    }

    const result = await AuthService.resetPassword(token, newPassword);
    return apiSuccess({ message: result.message });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", "Failed to reset password");
  }
}
