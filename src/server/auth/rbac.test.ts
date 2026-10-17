import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "../lib/db";
import { AuthService } from "./service";
import { requireAuth, requireRole, assertOwnership, AuthContextError } from "./rbac";
import { signAccessToken } from "./tokens";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

describe("Phase 3: Authorization Matrix & Route Protection (RBAC / Ownership / IDOR)", () => {
  let customerUser: any;
  let vendorUser: any;
  let adminUser: any;

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

    // Create Customer
    const custRes = await AuthService.signup({
      email: "cust.rbac@example.com",
      phone: "+919876543201",
      name: "Customer One",
      password: "Password123!",
      role: UserRole.CUSTOMER,
    });
    customerUser = custRes.user;

    // Create Vendor
    const vendRes = await AuthService.signup({
      email: "vend.rbac@example.com",
      phone: "+919876543202",
      name: "Vendor One",
      password: "Password123!",
      role: UserRole.VENDOR,
    });
    vendorUser = vendRes.user;

    // Create Admin
    const adminRes = await AuthService.signup({
      email: "admin.rbac@example.com",
      phone: "+919876543203",
      name: "Admin One",
      password: "Password123!",
      role: UserRole.ADMIN,
    });
    adminUser = adminRes.user;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ==========================================
  // 1. AUTHENTICATION EXTRACTION & TOKEN VERIFICATION
  // ==========================================
  describe("1. Token Extraction (Bearer header & Cookie) & Verification", () => {
    it("should reject request with no auth token (401)", async () => {
      const req = new NextRequest("http://localhost:3000/api/vendor/profile");
      await expect(requireAuth(req)).rejects.toThrow("Authentication required");
    });

    it("should reject malformed or unsigned token (401)", async () => {
      const req = new NextRequest("http://localhost:3000/api/vendor/profile", {
        headers: { authorization: "Bearer invalid.token.value" },
      });
      await expect(requireAuth(req)).rejects.toThrow("Invalid or expired session token");
    });

    it("should authenticate successfully via Authorization: Bearer <token>", async () => {
      const token = await signAccessToken({
        sub: customerUser.id,
        email: customerUser.email,
        role: customerUser.role,
        sessionId: "sess_customer_1",
      });

      const req = new NextRequest("http://localhost:3000/api/orders", {
        headers: { authorization: `Bearer ${token}` },
      });

      const ctx = await requireAuth(req);
      expect(ctx.user.id).toBe(customerUser.id);
      expect(ctx.user.role).toBe(UserRole.CUSTOMER);
    });

    it("should authenticate successfully via access_token cookie", async () => {
      const token = await signAccessToken({
        sub: vendorUser.id,
        email: vendorUser.email,
        role: vendorUser.role,
        sessionId: "sess_vendor_1",
      });

      const req = new NextRequest("http://localhost:3000/api/vendor/products", {
        headers: { cookie: `access_token=${token}` },
      });

      const ctx = await requireAuth(req);
      expect(ctx.user.id).toBe(vendorUser.id);
      expect(ctx.user.role).toBe(UserRole.VENDOR);
    });

    it("should reject authenticated user if user is suspended/banned (403)", async () => {
      await prisma.user.update({
        where: { id: customerUser.id },
        data: { isBanned: true },
      });

      const token = await signAccessToken({
        sub: customerUser.id,
        email: customerUser.email,
        role: customerUser.role,
        sessionId: "sess_customer_banned",
      });

      const req = new NextRequest("http://localhost:3000/api/customer/profile", {
        headers: { authorization: `Bearer ${token}` },
      });

      await expect(requireAuth(req)).rejects.toThrow(/suspended or deactivated/);
    });
  });

  // ==========================================
  // 2. ROLE-BASED ACCESS CONTROL (RBAC)
  // ==========================================
  describe("2. Role-Based Access Control (RBAC)", () => {
    it("should allow access when user role matches allowed roles", async () => {
      const token = await signAccessToken({
        sub: vendorUser.id,
        email: vendorUser.email,
        role: vendorUser.role,
        sessionId: "sess_vendor_2",
      });

      const req = new NextRequest("http://localhost:3000/api/vendor/inventory", {
        headers: { authorization: `Bearer ${token}` },
      });

      const ctx = await requireRole(req, [UserRole.VENDOR, UserRole.ADMIN]);
      expect(ctx.user.id).toBe(vendorUser.id);
    });

    it("should reject access when user has wrong role (403 Forbidden)", async () => {
      const token = await signAccessToken({
        sub: customerUser.id,
        email: customerUser.email,
        role: customerUser.role,
        sessionId: "sess_customer_2",
      });

      // Customer trying to access vendor-only endpoint
      const req = new NextRequest("http://localhost:3000/api/vendor/inventory", {
        headers: { authorization: `Bearer ${token}` },
      });

      await expect(requireRole(req, [UserRole.VENDOR])).rejects.toThrow(/Insufficient permissions/);
    });

    it("should allow ADMIN to access vendor or customer protected operations", async () => {
      const token = await signAccessToken({
        sub: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        sessionId: "sess_admin_1",
      });

      const req = new NextRequest("http://localhost:3000/api/vendor/inventory", {
        headers: { authorization: `Bearer ${token}` },
      });

      const ctx = await requireRole(req, [UserRole.VENDOR, UserRole.ADMIN]);
      expect(ctx.user.role).toBe(UserRole.ADMIN);
    });
  });

  // ==========================================
  // 3. RESOURCE-LEVEL OWNERSHIP & IDOR PREVENTION
  // ==========================================
  describe("3. Resource Ownership & IDOR Protection", () => {
    it("should permit resource owner to access own resource", () => {
      expect(() => {
        assertOwnership(customerUser.id, customerUser.id, UserRole.CUSTOMER);
      }).not.toThrow();
    });

    it("should block IDOR attempt when User A accesses User B resource (403)", () => {
      expect(() => {
        assertOwnership(customerUser.id, vendorUser.id, UserRole.CUSTOMER);
      }).toThrow(/Access denied: you do not have permission to access this resource/);
    });

    it("should permit ADMIN to override resource ownership check", () => {
      expect(() => {
        assertOwnership(adminUser.id, vendorUser.id, UserRole.ADMIN);
      }).not.toThrow();
    });
  });

  // ==========================================
  // 4. DELETED USER & STANDARDIZED API WRAPPERS
  // ==========================================
  describe("4. Edge Cases: Deleted User & Standardized API Responses", () => {
    it("should reject valid JWT if user was deleted from database (401)", async () => {
      const nonExistentId = "cuid_non_existent_deleted_user";
      const token = await signAccessToken({
        sub: nonExistentId,
        email: "deleted@example.com",
        role: UserRole.CUSTOMER,
        sessionId: "sess_deleted",
      });

      const req = new NextRequest("http://localhost:3000/api/profile", {
        headers: { authorization: `Bearer ${token}` },
      });

      await expect(requireAuth(req)).rejects.toThrow("User account no longer exists");
    });

    it("should format standardized API success and error responses", async () => {
      const { apiSuccess, apiError } = await import("./rbac");

      const successRes = apiSuccess({ hello: "world" }, 201);
      expect(successRes.status).toBe(201);
      const successJson = await successRes.json();
      expect(successJson).toEqual({
        success: true,
        data: { hello: "world" },
      });

      const errorRes = apiError(403, "FORBIDDEN", "Forbidden access", { field: "role" });
      expect(errorRes.status).toBe(403);
      const errorJson = await errorRes.json();
      expect(errorJson).toEqual({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Forbidden access",
          details: { field: "role" },
        },
      });
    });
  });
});

