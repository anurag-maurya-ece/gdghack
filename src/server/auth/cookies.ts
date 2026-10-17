export interface CookieOptions {
  name: string;
  value: string;
  maxAge: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
}

export function createAuthCookies(
  accessToken: string,
  refreshToken: string
): {
  accessTokenCookie: CookieOptions;
  refreshTokenCookie: CookieOptions;
  clearCookies: () => CookieOptions[];
} {
  const isProd = process.env.NODE_ENV === "production";

  const accessTokenCookie: CookieOptions = {
    name: "access_token",
    value: accessToken,
    maxAge: 15 * 60, // 15 minutes
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  };

  const refreshTokenCookie: CookieOptions = {
    name: "refresh_token",
    value: refreshToken,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  };

  const clearCookies = (): CookieOptions[] => [
    {
      name: "access_token",
      value: "",
      maxAge: 0,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    },
    {
      name: "refresh_token",
      value: "",
      maxAge: 0,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    },
  ];

  return {
    accessTokenCookie,
    refreshTokenCookie,
    clearCookies,
  };
}
