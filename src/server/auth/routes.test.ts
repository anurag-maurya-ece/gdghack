import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "../lib/db";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { POST as signupHandler } from "../../../app/api/auth/signup/route";
import { POST as loginHandler } from "../../../app/api/auth/login/route";
import { POST as refreshHandler } from "../../../app/api/auth/refresh/route";
import { POST as logoutHandler } from "../../../app/api/auth/logout/route";
import { GET as meHandler } from "../../../app/api/auth/me/route";
import { POST as forgotPasswordHandler } from "../../../app/api/auth/forgot-password/route";
import { POST as resetPasswordHandler } from "../../../app/api/auth/reset-password/route";
import { middleware } from "../../../middleware";

describe("Phase 3: Auth Route Handlers & Edge Middleware Integration", () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = "super_secret_jwt_key_at_least_32_chars_long_123";
    process.env.JWT_REFRESH_SECRET = "super_secret_refresh_jwt_key_at_least_32_chars_456";
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/tech_thela_test?schema=public";
  });

  beforeEach(async () => {
    await prisma.verificationToken.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.session.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.location.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ==========================================
  // 1. SIGNUP & LOGIN ROUTE HANDLERS
  // ==========================================
  describe("1. Signup and Login End-to-End API Handlers", () => {
    it("should register a user via POST /api/auth/signup", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "route.signup@example.com",
          phone: "+919876543301",
          name: "Route User",
          password: "ValidPassword123!",
          role: UserRole.VENDOR,
        }),
      });

      const res = await signupHandler(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.user.email).toBe("route.signup@example.com");
    });

    it("should authenticate user and set secure httpOnly cookies via POST /api/auth/login", async () => {
      // First register
      const signupReq = new NextRequest("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "route.login@example.com",
          phone: "+919876543302",
          name: "Login User",
          password: "ValidPassword123!",
          role: UserRole.CUSTOMER,
        }),
      });
      await signupHandler(signupReq);

      // Now login
      const loginReq = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "route.login@example.com",
          password: "ValidPassword123!",
        }),
      });

      const res = await loginHandler(loginReq);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.accessToken).toBeDefined();

      // Check cookies attached to response
      const accessCookie = res.cookies.get("access_token");
      const refreshCookie = res.cookies.get("refresh_token");
      expect(accessCookie).toBeDefined();
      expect(accessCookie?.httpOnly).toBe(true);
      expect(refreshCookie).toBeDefined();
      expect(refreshCookie?.httpOnly).toBe(true);
    });
  });

  // ==========================================
  // 2. ME & LOGOUT HANDLERS
  // ==========================================
  describe("2. GET /api/auth/me and POST /api/auth/logout", () => {
    it("should retrieve authenticated user via GET /api/auth/me", async () => {
      // Register and login
      const signupReq = new NextRequest("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "route.me@example.com",
          phone: "+919876543303",
          name: "Me User",
          password: "ValidPassword123!",
          role: UserRole.CUSTOMER,
        }),
      });
      await signupHandler(signupReq);

      const loginReq = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "route.me@example.com",
          password: "ValidPassword123!",
        }),
      });
      const loginRes = await loginHandler(loginReq);
      const token = (await loginRes.json()).data.accessToken;

      // Call /api/auth/me with Bearer token
      const meReq = new NextRequest("http://localhost:3000/api/auth/me", {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
      });
      const meRes = await meHandler(meReq);
      expect(meRes.status).toBe(200);
      const meJson = await meRes.json();
      expect(meJson.data.user.email).toBe("route.me@example.com");
    });

    it("should logout and clear cookies via POST /api/auth/logout", async () => {
      const logoutReq = new NextRequest("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: { cookie: "refresh_token=sample_token_to_clear" },
      });

      const logoutRes = await logoutHandler(logoutReq);
      expect(logoutRes.status).toBe(200);

      const clearedAccess = logoutRes.cookies.get("access_token");
      expect(clearedAccess?.maxAge).toBe(0);
    });
  });

  // ==========================================
  // 3. MIDDLEWARE SECURITY HEADERS & CSRF
  // ==========================================
  describe("3. Middleware Security Headers & CSRF Verification", () => {
    it("should attach strict security headers to responses", () => {
      const req = new NextRequest("http://localhost:3000/customer");
      const res = middleware(req);

      expect(res.headers.get("X-Frame-Options")).toBe("DENY");
      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(res.headers.get("Permissions-Policy")).toContain("geolocation=(self)");
    });

    it("should block CSRF attacks when Origin does not match Host on mutating cookie requests", () => {
      const req = new NextRequest("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          host: "localhost:3000",
          origin: "http://malicious-attacker.com",
          cookie: "access_token=valid_cookie_token",
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(403);
    });

    it("should allow mutating requests when Origin matches Host", () => {
      const req = new NextRequest("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          host: "localhost:3000",
          origin: "http://localhost:3000",
          cookie: "access_token=valid_cookie_token",
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(200);
    });
  });
});
