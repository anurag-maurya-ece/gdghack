export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { AuthService, AuthError } from "@/server/auth/service";
import { createAuthCookies } from "@/server/auth/cookies";
import { apiSuccess, apiError } from "@/server/auth/rbac";

export async function POST(request: NextRequest) {
  try {
    let rawRefreshToken: string | undefined;

    // 1. Try reading from cookie
    const cookieToken = request.cookies.get("refresh_token")?.value;
    if (cookieToken) {
      rawRefreshToken = cookieToken;
    } else {
      // 2. Fallback to body
      try {
        const body = await request.json();
        rawRefreshToken = body?.refreshToken;
      } catch {
        // No body
      }
    }

    if (!rawRefreshToken) {
      return apiError(401, "REFRESH_TOKEN_REQUIRED", "Refresh token is missing");
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const result = await AuthService.refreshSession(rawRefreshToken);
    const cookies = createAuthCookies(result.accessToken, result.rawRefreshToken);

    const response = apiSuccess({
      accessToken: result.accessToken,
    });

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
    if (error instanceof AuthError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", "Token refresh failed");
  }
}
