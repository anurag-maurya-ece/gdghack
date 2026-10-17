import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const pathname = request.nextUrl.pathname;

  // 1. Injected Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // 2. CSRF Protection for mutating methods on API routes
  const isMutatingMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(request.method);
  const isApiRoute = pathname.startsWith("/api/");
  const isWebhook = pathname.startsWith("/api/whatsapp/webhook");

  if (isApiRoute && isMutatingMethod && !isWebhook) {
    // If request carries cookie-based authentication, enforce Origin/Referer verification
    const hasAuthCookie = request.cookies.has("access_token") || request.cookies.has("refresh_token");
    const authHeader = request.headers.get("authorization");

    // Cookie auth without Authorization header requires Origin verification
    if (hasAuthCookie && !authHeader) {
      if (origin) {
        try {
          const originHost = new URL(origin).host;
          if (host && originHost !== host) {
            return NextResponse.json(
              {
                success: false,
                error: {
                  code: "CSRF_DETECTED",
                  message: "Cross-site request forgery protection triggered. Origin mismatch.",
                },
              },
              { status: 403 }
            );
          }
        } catch {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "CSRF_DETECTED",
                message: "Invalid Origin header.",
              },
            },
            { status: 403 }
          );
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.png, .jpg, .svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
