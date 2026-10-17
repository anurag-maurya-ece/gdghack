export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { AuthService, AuthError } from "@/server/auth/service";
import { apiSuccess, apiError } from "@/server/auth/rbac";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await AuthService.signup(body);

    return apiSuccess(
      {
        user: result.user,
        message: "Registration successful. Please verify your email address.",
      },
      201
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return apiError(400, "VALIDATION_ERROR", "Invalid input parameters", error.issues);
    }
    if (error instanceof AuthError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", "An unexpected error occurred during signup");
  }
}
