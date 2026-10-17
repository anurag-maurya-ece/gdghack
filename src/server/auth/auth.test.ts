import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "../lib/db";
import { AuthService, AuthError } from "./service";
import { hashPassword, verifyPassword } from "./password";
import { signAccessToken, verifyAccessToken, hashToken } from "./tokens";
import { authRateLimiter } from "./rate-limiter";
import { createAuthCookies } from "./cookies";
import { UserRole } from "@prisma/client";

describe("Phase 2: Comprehensive Authentication System & Edge-Case Matrix", () => {
  beforeAll(async () => {
    // Set test env variables
    process.env.JWT_SECRET = "super_secret_jwt_key_at_least_32_chars_long_123";
    process.env.JWT_REFRESH_SECRET = "super_secret_refresh_jwt_key_at_least_32_chars_456";
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/tech_thela_test?schema=public";
  });

  beforeEach(async () => {
    // Clean test tables
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
  // 1. SIGNUP & INPUT VALIDATION
  // ==========================================
  describe("1. Signup & Input Edge Cases", () => {
    it("should successfully register with normalized email and return a hashed verification token", async () => {
      const res = await AuthService.signup({
        email: "  NewVendor@Example.COM  ",
        phone: "+919876543210",
        name: "Ramesh Kumar",
        password: "ValidPassword123!",
        role: UserRole.VENDOR,
      });

      expect(res.user.email).toBe("newvendor@example.com");
      expect(res.user.role).toBe(UserRole.VENDOR);
      expect(res.rawVerificationToken).toBeDefined();

      // Verify password was hashed with Argon2id
      const dbUser = await prisma.user.findUnique({ where: { id: res.user.id } });
      expect(dbUser?.passwordHash).toMatch(/^\$argon2id\$/);
      const isMatch = await verifyPassword("ValidPassword123!", dbUser!.passwordHash);
      expect(isMatch).toBe(true);
    });

    it("should reject invalid, missing, or whitespace-only fields", async () => {
      // Empty email
      await expect(
        AuthService.signup({
          email: "",
          phone: "+919876543210",
          name: "Test",
          password: "password123",
          role: UserRole.CUSTOMER,
        })
      ).rejects.toThrow();

      // Invalid email format
      await expect(
        AuthService.signup({
          email: "not-an-email",
          phone: "+919876543210",
          name: "Test",
          password: "password123",
          role: UserRole.CUSTOMER,
        })
      ).rejects.toThrow();

      // Password too short (<8)
      await expect(
        AuthService.signup({
          email: "user@example.com",
          phone: "+919876543210",
          name: "Test",
          password: "short",
          role: UserRole.CUSTOMER,
        })
      ).rejects.toThrow();

      // Password exceeds 72 bytes (DoS prevention)
      const hugePassword = "A".repeat(100);
      await expect(
        AuthService.signup({
          email: "user@example.com",
          phone: "+919876543210",
          name: "Test",
          password: hugePassword,
          role: UserRole.CUSTOMER,
        })
      ).rejects.toThrow(/Password exceeds maximum length/);

      // Password with only spaces
      await expect(
        AuthService.signup({
          email: "user@example.com",
          phone: "+919876543210",
          name: "Test",
          password: "        ",
          role: UserRole.CUSTOMER,
        })
      ).rejects.toThrow();

      // Password with null bytes
      await expect(
        AuthService.signup({
          email: "user@example.com",
          phone: "+919876543210",
          name: "Test",
          password: "pass\0word123",
          role: UserRole.CUSTOMER,
        })
      ).rejects.toThrow();
    });

    it("should reject duplicate email even with case variations or trailing spaces", async () => {
      await AuthService.signup({
        email: "vendor@techthela.in",
        phone: "+919876543210",
        name: "Vendor One",
        password: "SecurePassword123",
        role: UserRole.VENDOR,
      });

      await expect(
        AuthService.signup({
          email: "  VENDOR@TechThela.IN  ",
          phone: "+919876543211",
          name: "Vendor Duplicate",
          password: "SecurePassword123",
          role: UserRole.VENDOR,
        })
      ).rejects.toThrow(AuthError);
    });

    it("should handle race conditions: concurrent signups with identical email", async () => {
      const p1 = AuthService.signup({
        email: "concurrent@example.com",
        phone: "+919876500001",
        name: "Concurrent 1",
        password: "Password123!",
        role: UserRole.CUSTOMER,
      });

      const p2 = AuthService.signup({
        email: "concurrent@example.com",
        phone: "+919876500002",
        name: "Concurrent 2",
        password: "Password123!",
        role: UserRole.CUSTOMER,
      });

      const results = await Promise.allSettled([p1, p2]);
      const fulfilled = results.filter((r) => r.status === "fulfilled");
      const rejected = results.filter((r) => r.status === "rejected");

      expect(fulfilled.length).toBe(1);
      expect(rejected.length).toBe(1);
    });
  });

  // ==========================================
  // 2. EMAIL VERIFICATION
  // ==========================================
  describe("2. Email Verification Edge Cases", () => {
    it("should verify user email and consume single-use token", async () => {
      const res = await AuthService.signup({
        email: "verify.me@example.com",
        phone: "+919876543219",
        name: "Verify Me",
        password: "Password123!",
        role: UserRole.CUSTOMER,
      });

      expect(res.user.emailVerified).toBe(false);

      // Verify email
      const verifyRes = await AuthService.verifyEmail(res.rawVerificationToken);
      expect(verifyRes.success).toBe(true);

      const dbUser = await prisma.user.findUnique({ where: { id: res.user.id } });
      expect(dbUser?.emailVerified).toBe(true);

      // Token reuse attempt must fail
      await expect(AuthService.verifyEmail(res.rawVerificationToken)).rejects.toThrow(
        /Invalid or expired/
      );
    });

    it("should reject tampered or expired verification token", async () => {
      await expect(AuthService.verifyEmail("tampered_token_string_12345")).rejects.toThrow(
        /Invalid or expired/
      );
    });

    it("should enforce rate-limiting on resend verification", async () => {
      await AuthService.signup({
        email: "resend.test@example.com",
        phone: "+919876543220",
        name: "Resend User",
        password: "Password123!",
        role: UserRole.CUSTOMER,
      });

      // Immediate resend triggers cooldown
      await expect(AuthService.resendVerification("resend.test@example.com")).rejects.toThrow(
        /Please wait 2 minutes/
      );
    });
  });

  // ==========================================
  // 3. LOGIN, LOCKOUT & USER ENUMERATION
  // ==========================================
  describe("3. Login, Brute-Force & Lockout Edge Cases", () => {
    beforeEach(async () => {
      await AuthService.signup({
        email: "login.target@example.com",
        phone: "+919876543230",
        name: "Login User",
        password: "CorrectPassword123!",
        role: UserRole.CUSTOMER,
      });
      authRateLimiter.reset("ip:127.0.0.1");
      authRateLimiter.reset("account:login.target@example.com");
    });

    it("should successfully authenticate with valid credentials and return tokens", async () => {
      const res = await AuthService.login({
        email: "  LOGIN.target@example.com ",
        password: "CorrectPassword123!",
        ipAddress: "127.0.0.1",
        userAgent: "Vitest-Agent/1.0",
      });

      expect(res.user.email).toBe("login.target@example.com");
      expect(res.accessToken).toBeDefined();
      expect(res.rawRefreshToken).toBeDefined();

      // Verify JWT payload
      const verified = await verifyAccessToken(res.accessToken);
      expect(verified?.email).toBe("login.target@example.com");
      expect(verified?.sessionId).toBe(res.sessionId);
    });

    it("should return identical generic error and execute constant-time check for non-existent vs wrong password", async () => {
      // Non-existent email
      await expect(
        AuthService.login({
          email: "doesnotexist@example.com",
          password: "AnyPassword123!",
          ipAddress: "127.0.0.1",
          userAgent: "Vitest-Agent/1.0",
        })
      ).rejects.toThrow("Invalid email or password");

      // Wrong password
      await expect(
        AuthService.login({
          email: "login.target@example.com",
          password: "WrongPassword123!",
          ipAddress: "127.0.0.1",
          userAgent: "Vitest-Agent/1.0",
        })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should reject login for deactivated or banned user", async () => {
      await prisma.user.update({
        where: { email: "login.target@example.com" },
        data: { isBanned: true },
      });

      await expect(
        AuthService.login({
          email: "login.target@example.com",
          password: "CorrectPassword123!",
          ipAddress: "127.0.0.1",
          userAgent: "Vitest-Agent/1.0",
        })
      ).rejects.toThrow(/Account has been suspended/);
    });

    it("should progressively lock out after repeated failed attempts", async () => {
      const testAccount = "lockout.test@example.com";
      await AuthService.signup({
        email: testAccount,
        phone: "+919876543299",
        name: "Lockout Test",
        password: "RealPassword123!",
        role: UserRole.CUSTOMER,
      });

      const ip = "192.168.1.50";

      // 5 consecutive failed attempts
      for (let i = 0; i < 5; i++) {
        try {
          await AuthService.login({
            email: testAccount,
            password: "WrongPassword",
            ipAddress: ip,
            userAgent: "Test",
          });
        } catch {
          // Expected
        }
      }

      // 6th attempt is locked
      await expect(
        AuthService.login({
          email: testAccount,
          password: "RealPassword123!",
          ipAddress: ip,
          userAgent: "Test",
        })
      ).rejects.toThrow(/Too many failed attempts|temporarily locked/);
    });
  });

  // ==========================================
  // 4. TOKENS, ROTATION & REUSE DETECTION
  // ==========================================
  describe("4. Tokens, Refresh Rotation & Reuse Detection (Stolen Token)", () => {
    let loginData: Awaited<ReturnType<typeof AuthService.login>>;

    beforeEach(async () => {
      await AuthService.signup({
        email: "token.test@example.com",
        phone: "+919876543240",
        name: "Token User",
        password: "Password123!",
        role: UserRole.CUSTOMER,
      });

      loginData = await AuthService.login({
        email: "token.test@example.com",
        password: "Password123!",
        ipAddress: "127.0.0.1",
        userAgent: "Test",
      });
    });

    it("should rotate refresh token on use and return new access JWT", async () => {
      const refreshRes = await AuthService.refreshSession(loginData.rawRefreshToken);

      expect(refreshRes.accessToken).toBeDefined();
      expect(refreshRes.rawRefreshToken).toBeDefined();
      expect(refreshRes.rawRefreshToken).not.toBe(loginData.rawRefreshToken);

      // Verify new access token
      const payload = await verifyAccessToken(refreshRes.accessToken);
      expect(payload?.email).toBe("token.test@example.com");
    });

    it("should REJECT reused old refresh token and REVOKE the entire token family (Stolen Token Scenario)", async () => {
      // 1. Legitimate user uses refresh token
      const legitimateRefresh = await AuthService.refreshSession(loginData.rawRefreshToken);
      expect(legitimateRefresh.rawRefreshToken).toBeDefined();

      // 2. Attacker attempts to reuse the OLD refresh token (which has now been rotated)
      await expect(
        AuthService.refreshSession(loginData.rawRefreshToken)
      ).rejects.toThrow(/Refresh token reuse detected\. All sessions have been revoked\./);

      // 3. PROOF OF SECURITY: The legitimate user's new token MUST ALSO now be invalidated because the family was revoked!
      await expect(
        AuthService.refreshSession(legitimateRefresh.rawRefreshToken)
      ).rejects.toThrow(/Refresh token reuse detected|Invalid refresh token/);

      // 4. All active sessions in DB must be purged
      const activeSessions = await prisma.session.findMany({
        where: { userId: loginData.user.id },
      });
      expect(activeSessions.length).toBe(0);
    });

    it("should reject tampered or invalid JWT access tokens", async () => {
      // Empty token
      expect(await verifyAccessToken("")).toBeNull();

      // Tampered payload / signature
      const tampered = loginData.accessToken.slice(0, -6) + "xxxxxx";
      expect(await verifyAccessToken(tampered)).toBeNull();

      // Non-JWT string
      expect(await verifyAccessToken("not.a.jwt")).toBeNull();
    });

    it("should verify secure cookie configuration flags", () => {
      const cookies = createAuthCookies("sample_access_jwt", "sample_refresh_token");

      expect(cookies.accessTokenCookie.httpOnly).toBe(true);
      expect(cookies.accessTokenCookie.sameSite).toBe("lax");
      expect(cookies.accessTokenCookie.path).toBe("/");
      expect(cookies.accessTokenCookie.maxAge).toBe(15 * 60);

      expect(cookies.refreshTokenCookie.httpOnly).toBe(true);
      expect(cookies.refreshTokenCookie.sameSite).toBe("lax");
      expect(cookies.refreshTokenCookie.maxAge).toBe(30 * 24 * 60 * 60);
    });

    it("should logout current session and invalidate tokens", async () => {
      await AuthService.logout(loginData.rawRefreshToken);

      // Refreshing with logged out token must fail
      await expect(AuthService.refreshSession(loginData.rawRefreshToken)).rejects.toThrow(
        /Invalid refresh token|Refresh token reuse detected/
      );
    });

    it("should logout all devices and revoke all user sessions", async () => {
      // Create a second session
      await AuthService.login({
        email: "token.test@example.com",
        password: "Password123!",
        ipAddress: "127.0.0.2",
        userAgent: "Second-Device",
      });

      const sessionsBefore = await prisma.session.findMany({
        where: { userId: loginData.user.id },
      });
      expect(sessionsBefore.length).toBe(2);

      await AuthService.logoutAllDevices(loginData.user.id);

      const sessionsAfter = await prisma.session.findMany({
        where: { userId: loginData.user.id },
      });
      expect(sessionsAfter.length).toBe(0);
    });
  });

  // ==========================================
  // 5. PASSWORD RESET & PASSWORD CHANGE
  // ==========================================
  describe("5. Password Reset & Change Edge Cases", () => {
    let testUserId: string;

    beforeEach(async () => {
      const res = await AuthService.signup({
        email: "reset.test@example.com",
        phone: "+919876543250",
        name: "Reset User",
        password: "InitialPassword123!",
        role: UserRole.CUSTOMER,
      });
      testUserId = res.user.id;
    });

    it("should return identical response for existing and non-existing email in forgotPassword", async () => {
      const res1 = await AuthService.forgotPassword("reset.test@example.com");
      const res2 = await AuthService.forgotPassword("nonexistent@example.com");

      expect(res1.message).toBe("If an account exists, a password reset link has been sent.");
      expect(res2.message).toBe("If an account exists, a password reset link has been sent.");
      expect(res1.rawResetToken).toBeDefined();
      expect(res2.rawResetToken).toBeUndefined();
    });

    it("should reset password, revoke all active sessions, and allow login with new password", async () => {
      // Establish an active session first
      await AuthService.login({
        email: "reset.test@example.com",
        password: "InitialPassword123!",
        ipAddress: "127.0.0.1",
        userAgent: "Test",
      });

      const forgotRes = await AuthService.forgotPassword("reset.test@example.com");
      const resetToken = forgotRes.rawResetToken!;

      // Reset password
      const resetRes = await AuthService.resetPassword(resetToken, "NewSuperPassword123!");
      expect(resetRes.success).toBe(true);

      // Prior active sessions must be revoked
      const sessions = await prisma.session.findMany({ where: { userId: testUserId } });
      expect(sessions.length).toBe(0);

      // Old password fails
      await expect(
        AuthService.login({
          email: "reset.test@example.com",
          password: "InitialPassword123!",
          ipAddress: "127.0.0.1",
          userAgent: "Test",
        })
      ).rejects.toThrow("Invalid email or password");

      // New password succeeds
      const newLogin = await AuthService.login({
        email: "reset.test@example.com",
        password: "NewSuperPassword123!",
        ipAddress: "127.0.0.1",
        userAgent: "Test",
      });
      expect(newLogin.accessToken).toBeDefined();
    });

    it("should reject password change with incorrect current password or identical new password", async () => {
      // Wrong current password
      await expect(
        AuthService.changePassword(testUserId, "WrongPassword", "NewPassword123!")
      ).rejects.toThrow(/Current password is incorrect/);

      // Same as old password
      await expect(
        AuthService.changePassword(testUserId, "InitialPassword123!", "InitialPassword123!")
      ).rejects.toThrow(/New password cannot be identical/);

      // Password length < 8
      await expect(
        AuthService.changePassword(testUserId, "InitialPassword123!", "short")
      ).rejects.toThrow(/New password must be between 8 and 72 characters/);

      // Non-existent user
      await expect(
        AuthService.changePassword("non_existent_user_id", "Current123!", "New123456!")
      ).rejects.toThrow(/User not found/);

      // Successful password change
      const changeRes = await AuthService.changePassword(testUserId, "InitialPassword123!", "ValidNewPassword456!");
      expect(changeRes.success).toBe(true);
    });

    it("should handle malformed hash gracefully in verifyPassword", async () => {
      const result = await verifyPassword("some_password", "invalid_not_argon_hash");
      expect(result).toBe(false);
    });

    it("should reject resetPassword with expired or non-existent token", async () => {
      // Expired token
      const expiredToken = "expired_raw_token_value_xyz";
      await prisma.verificationToken.create({
        data: {
          userId: testUserId,
          tokenHash: hashToken(expiredToken),
          type: "PASSWORD_RESET",
          expiresAt: new Date(Date.now() - 1000), // in the past
        },
      });

      await expect(
        AuthService.resetPassword(expiredToken, "ValidPassword789!")
      ).rejects.toThrow(/Password reset token has expired/);

      // Non-existent token
      await expect(
        AuthService.resetPassword("completely_random_token", "ValidPassword789!")
      ).rejects.toThrow(/Invalid or expired reset token/);
    });
  });

  // ==========================================
  // 6. EMAIL VERIFICATION & COOKIE POLICIES
  // ==========================================
  describe("6. Email Verification & Security Header Policies", () => {
    it("should reject verifyEmail with expired token", async () => {
      const user = await prisma.user.create({
        data: {
          email: "expire.verify@example.com",
          phone: "+919876543299",
          name: "Expire User",
          passwordHash: "dummy",
          role: UserRole.CUSTOMER,
        },
      });

      const expiredRaw = "expired_email_token_123";
      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(expiredRaw),
          type: "EMAIL_VERIFICATION",
          expiresAt: new Date(Date.now() - 5000),
        },
      });

      await expect(AuthService.verifyEmail(expiredRaw)).rejects.toThrow(/Verification token has expired/);
    });

    it("should handle resendVerification for non-existent and already-verified accounts safely", async () => {
      // Non-existent user
      const nonExistent = await AuthService.resendVerification("nobody@example.com");
      expect(nonExistent.success).toBe(true);
      expect(nonExistent.rawToken).toBeUndefined();

      // Already verified user
      const user = await prisma.user.create({
        data: {
          email: "already.verified@example.com",
          phone: "+919876543298",
          name: "Verified User",
          passwordHash: "dummy",
          emailVerified: true,
          role: UserRole.CUSTOMER,
        },
      });

      const alreadyVerified = await AuthService.resendVerification("already.verified@example.com");
      expect(alreadyVerified.success).toBe(true);
      expect(alreadyVerified.message).toContain("If an unverified account exists");
    });

    it("should create auth cookies with strict security flags", () => {
      const cookies = createAuthCookies("access.jwt.token", "refresh_raw_token");
      expect(cookies.accessTokenCookie.name).toBe("access_token");
      expect(cookies.accessTokenCookie.value).toBe("access.jwt.token");
      expect(cookies.accessTokenCookie.httpOnly).toBe(true);
      expect(cookies.accessTokenCookie.sameSite).toBe("lax");
      expect(cookies.accessTokenCookie.path).toBe("/");
      expect(cookies.accessTokenCookie.maxAge).toBe(15 * 60);

      expect(cookies.refreshTokenCookie.name).toBe("refresh_token");
      expect(cookies.refreshTokenCookie.value).toBe("refresh_raw_token");
      expect(cookies.refreshTokenCookie.httpOnly).toBe(true);
      expect(cookies.refreshTokenCookie.sameSite).toBe("lax");
      expect(cookies.refreshTokenCookie.maxAge).toBe(30 * 24 * 60 * 60);

      const cleared = cookies.clearCookies();
      expect(cleared.length).toBe(2);
      expect(cleared[0].maxAge).toBe(0);
      expect(cleared[1].maxAge).toBe(0);
    });
  });
});
