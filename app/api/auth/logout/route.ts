import { NextRequest } from "next/server";
import { AuthService } from "@/server/auth/service";
import { createAuthCookies } from "@/server/auth/cookies";
import { apiSuccess } from "@/server/auth/rbac";

export async function POST(request: NextRequest) {
  try {
    const rawRefreshToken =
      request.cookies.get("refresh_token")?.value ||
      (await request.json().catch(() => ({})))?.refreshToken;

    if (rawRefreshToken) {
      await AuthService.logout(rawRefreshToken);
    }
  } catch {
    // Graceful logout even if token was already expired
  }

  const cookies = createAuthCookies("", "");
  const cleared = cookies.clearCookies();

  const response = apiSuccess({ message: "Successfully logged out" });

  for (const cookie of cleared) {
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });
  }

  return response;
}
