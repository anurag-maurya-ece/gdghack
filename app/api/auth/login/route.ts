import { NextRequest, NextResponse } from "next/server";
import { AuthService, AuthError } from "@/server/auth/service";
import { createAuthCookies } from "@/server/auth/cookies";
import { apiSuccess, apiError } from "@/server/auth/rbac";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const result = await AuthService.login({
      ...body,
      ipAddress,
      userAgent,
    });

    const cookies = createAuthCookies(result.accessToken, result.rawRefreshToken);

    const response = apiSuccess({
      user: result.user,
      accessToken: result.accessToken,
    });

    // Attach httpOnly cookies
    response.cookies.set(cookies.accessTokenCookie.name, cookies.accessTokenCookie.value, {
      httpOnly: cookies.accessTokenCookie.httpOnly,
      secure: cookies.accessTokenCookie.secure,
      sameSite: cookies.accessTokenCookie.sameSite,
      path: cookies.accessTokenCookie.path,
      maxAge: cookies.accessTokenCookie.maxAge,
    });

    response.cookies.set(cookies.refreshTokenCookie.name, cookies.refreshTokenCookie.value, {
      httpOnly: cookies.refreshTokenCookie.httpOnly,
      secure: cookies.refreshTokenCookie.secure,
      sameSite: cookies.refreshTokenCookie.sameSite,
      path: cookies.refreshTokenCookie.path,
      maxAge: cookies.refreshTokenCookie.maxAge,
    });

    return response;
  } catch (error: any) {
    if (error instanceof ZodError) {
      return apiError(400, "VALIDATION_ERROR", "Invalid email or password format", error.issues);
    }
    if (error instanceof AuthError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", "Authentication failed");
  }
}
