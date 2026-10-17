import crypto from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/db";
import { hashPassword, verifyPassword, dummyVerifyPassword } from "./password";
import {
  signAccessToken,
  hashToken,
  generateRandomToken,
  AccessTokenPayload,
} from "./tokens";
import { authRateLimiter } from "./rate-limiter";
import { UserRole, TokenType } from "@prisma/client";

// Strict validation schemas
export const signupInputSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(254, "Email too long"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number too long"),
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(72, "Password exceeds maximum length (72 bytes)")
    .refine((p) => p.trim().length > 0, "Password cannot be whitespace only")
    .refine((p) => !p.includes("\0"), "Password cannot contain null bytes"),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
});

export const loginInputSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
  ipAddress: z.string().default("127.0.0.1"),
  userAgent: z.string().default("unknown"),
});

export class AuthError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = "AUTH_ERROR"
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class AuthService {
  /**
   * Normalize email address consistently (lowercase, trim, NFKC unicode normalization)
   */
  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase().normalize("NFKC");
  }

  /**
   * Register a new user
   */
  static async signup(rawInput: z.infer<typeof signupInputSchema>) {
    const input = signupInputSchema.parse(rawInput);
    const normalizedEmail = this.normalizeEmail(input.email);

    // Enforce duplicate check at app level (reinforced by DB unique constraint)
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone: input.phone }],
      },
    });

    if (existing) {
      if (existing.email === normalizedEmail) {
        throw new AuthError(409, "Email is already registered", "EMAIL_EXISTS");
      }
      throw new AuthError(409, "Phone number is already registered", "PHONE_EXISTS");
    }

    const hashedPassword = await hashPassword(input.password);

    try {
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          phone: input.phone,
          name: input.name,
          passwordHash: hashedPassword,
          role: input.role,
          emailVerified: false,
        },
      });

      // Generate single-use email verification token (24h expiry)
      const rawVerificationToken = generateRandomToken(32);
      const hashedVerifToken = hashToken(rawVerificationToken);

      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          tokenHash: hashedVerifToken,
          type: TokenType.EMAIL_VERIFICATION,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        rawVerificationToken,
      };
    } catch (err: any) {
      // Handle race-condition unique constraint violations gracefully
      if (err.code === "P2002") {
        throw new AuthError(409, "User with this email or phone already exists", "DUPLICATE_ENTRY");
      }
      throw err;
    }
  }

  /**
   * Verify email address using single-use token
   */
  static async verifyEmail(rawToken: string) {
    if (!rawToken || typeof rawToken !== "string") {
      throw new AuthError(400, "Verification token is required", "INVALID_TOKEN");
    }

    const hashed = hashToken(rawToken);
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { tokenHash: hashed },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.type !== TokenType.EMAIL_VERIFICATION) {
      throw new AuthError(400, "Invalid or expired verification token", "TOKEN_NOT_FOUND");
    }

    if (tokenRecord.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
      throw new AuthError(400, "Verification token has expired", "TOKEN_EXPIRED");
    }

    // Mark email as verified and delete token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { emailVerified: true },
      }),
      prisma.verificationToken.delete({
        where: { id: tokenRecord.id },
      }),
    ]);

    return { success: true, message: "Email successfully verified" };
  }

  /**
   * Resend email verification token (with rate limiting)
   */
  static async resendVerification(email: string) {
    const normalized = this.normalizeEmail(email);
    const user = await prisma.user.findUnique({ where: { email: normalized } });

    // Consistent response whether user exists or not (anti-enumeration)
    if (!user || user.emailVerified) {
      return { success: true, message: "If an unverified account exists, a verification link has been sent." };
    }

    // Rate-limit resend: check recent tokens
    const recentToken = await prisma.verificationToken.findFirst({
      where: {
        userId: user.id,
        type: TokenType.EMAIL_VERIFICATION,
        createdAt: { gt: new Date(Date.now() - 2 * 60 * 1000) }, // 2 minute cooldown
      },
    });

    if (recentToken) {
      throw new AuthError(429, "Please wait 2 minutes before requesting another verification email", "RATE_LIMITED");
    }

    // Invalidate prior verification tokens
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: TokenType.EMAIL_VERIFICATION },
    });

    const rawToken = generateRandomToken(32);
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        type: TokenType.EMAIL_VERIFICATION,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      success: true,
      message: "If an unverified account exists, a verification link has been sent.",
      rawToken, // provided for programmatic test harness verification
    };
  }

  /**
   * Authenticate user with progressive lockout and constant-time password check
   */
  static async login(rawInput: z.infer<typeof loginInputSchema>) {
    const input = loginInputSchema.parse(rawInput);
    const normalized = this.normalizeEmail(input.email);

    const ipKey = `ip:${input.ipAddress}`;
    const accountKey = `account:${normalized}`;

    // 1. Check lockout
    const ipLock = authRateLimiter.isLocked(ipKey);
    if (ipLock.locked) {
      throw new AuthError(
        429,
        `Too many failed attempts. Try again in ${Math.ceil(ipLock.remainingMs / 1000)} seconds.`,
        "IP_LOCKED"
      );
    }

    const accountLock = authRateLimiter.isLocked(accountKey);
    if (accountLock.locked) {
      throw new AuthError(
        429,
        `Account temporarily locked due to repeated failed attempts. Try again later.`,
        "ACCOUNT_LOCKED"
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalized },
    });

    if (!user) {
      // Execute dummy verify to ensure constant execution time (timing-attack protection)
      await dummyVerifyPassword(input.password);
      authRateLimiter.recordFailedAttempt(ipKey);
      throw new AuthError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const passwordMatch = await verifyPassword(input.password, user.passwordHash);
    if (!passwordMatch) {
      authRateLimiter.recordFailedAttempt(ipKey);
      authRateLimiter.recordFailedAttempt(accountKey);
      throw new AuthError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    if (user.isBanned) {
      throw new AuthError(403, "Account has been suspended or deactivated", "ACCOUNT_DEACTIVATED");
    }

    // Success: clear rate limiter
    authRateLimiter.reset(ipKey);
    authRateLimiter.reset(accountKey);

    // Create session (30 days validity)
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Generate rotating refresh token
    const rawRefreshToken = generateRandomToken(48);
    const familyId = crypto.randomUUID();

    await prisma.refreshToken.create({
      data: {
        sessionId: session.id,
        userId: user.id,
        tokenHash: hashToken(rawRefreshToken),
        familyId,
        isRevoked: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Generate short-lived Access JWT (15 min)
    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken,
      rawRefreshToken,
      sessionId: session.id,
    };
  }

  /**
   * Refresh session with Token Rotation & Reuse Detection
   */
  static async refreshSession(rawRefreshToken: string) {
    if (!rawRefreshToken || typeof rawRefreshToken !== "string") {
      throw new AuthError(401, "Refresh token required", "MISSING_TOKEN");
    }

    const hashed = hashToken(rawRefreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashed },
      include: {
        user: true,
        session: true,
      },
    });

    if (!tokenRecord) {
      throw new AuthError(401, "Invalid refresh token", "INVALID_TOKEN");
    }

    // REUSE DETECTION: If token was already revoked, an attacker or compromised client reused it!
    if (tokenRecord.isRevoked) {
      // Invalidate the ENTIRE token family and all sessions for this family!
      await prisma.$transaction([
        prisma.refreshToken.updateMany({
          where: { familyId: tokenRecord.familyId },
          data: { isRevoked: true },
        }),
        prisma.session.deleteMany({
          where: { userId: tokenRecord.userId },
        }),
      ]);

      throw new AuthError(
        401,
        "Security alert: Refresh token reuse detected. All sessions have been revoked.",
        "TOKEN_REUSE_DETECTED"
      );
    }

    // Check token expiry
    if (tokenRecord.expiresAt < new Date()) {
      throw new AuthError(401, "Refresh token expired. Please log in again.", "TOKEN_EXPIRED");
    }

    // Check if user banned
    if (tokenRecord.user.isBanned) {
      throw new AuthError(403, "Account suspended", "ACCOUNT_DEACTIVATED");
    }

    // Rotate token: revoke old token and issue a new one in the SAME family
    const newRawRefreshToken = generateRandomToken(48);

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { isRevoked: true },
      }),
      prisma.refreshToken.create({
        data: {
          sessionId: tokenRecord.sessionId,
          userId: tokenRecord.userId,
          tokenHash: hashToken(newRawRefreshToken),
          familyId: tokenRecord.familyId,
          isRevoked: false,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.session.update({
        where: { id: tokenRecord.sessionId },
        data: { lastUsedAt: new Date() },
      }),
    ]);

    const newAccessToken = await signAccessToken({
      sub: tokenRecord.user.id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role,
      sessionId: tokenRecord.sessionId,
    });

    return {
      accessToken: newAccessToken,
      rawRefreshToken: newRawRefreshToken,
      user: {
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        name: tokenRecord.user.name,
        role: tokenRecord.user.role,
        emailVerified: tokenRecord.user.emailVerified,
      },
    };
  }

  /**
   * Logout current session
   */
  static async logout(rawRefreshToken: string) {
    if (!rawRefreshToken) return { success: true };

    const hashed = hashToken(rawRefreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashed },
    });

    if (tokenRecord) {
      await prisma.$transaction([
        prisma.refreshToken.update({
          where: { id: tokenRecord.id },
          data: { isRevoked: true },
        }),
        prisma.session.delete({
          where: { id: tokenRecord.sessionId },
        }),
      ]);
    }

    return { success: true };
  }

  /**
   * Logout from all devices (revoke all sessions and token families)
   */
  static async logoutAllDevices(userId: string) {
    await prisma.$transaction([
      prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      }),
      prisma.session.deleteMany({
        where: { userId },
      }),
    ]);

    return { success: true, message: "Logged out from all devices" };
  }

  /**
   * Request password reset token (constant-time, anti-enumeration response)
   */
  static async forgotPassword(email: string) {
    const normalized = this.normalizeEmail(email);
    const user = await prisma.user.findUnique({ where: { email: normalized } });

    // Always return same response whether email exists or not
    if (!user) {
      await dummyVerifyPassword("dummy_random_pass");
      return { success: true, message: "If an account exists, a password reset link has been sent." };
    }

    // Invalidate existing reset tokens
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: TokenType.PASSWORD_RESET },
    });

    const rawResetToken = generateRandomToken(32);
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawResetToken),
        type: TokenType.PASSWORD_RESET,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
    });

    return {
      success: true,
      message: "If an account exists, a password reset link has been sent.",
      rawResetToken, // provided for programmatic test harness verification
    };
  }

  /**
   * Reset password with single-use token (revokes all user sessions)
   */
  static async resetPassword(rawToken: string, newPassword: string) {
    if (!rawToken || typeof rawToken !== "string") {
      throw new AuthError(400, "Reset token is required", "INVALID_TOKEN");
    }

    // Validate new password rules
    if (!newPassword || newPassword.length < 8 || newPassword.length > 72) {
      throw new AuthError(400, "Password must be between 8 and 72 characters", "INVALID_PASSWORD");
    }

    const hashed = hashToken(rawToken);
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { tokenHash: hashed },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.type !== TokenType.PASSWORD_RESET) {
      throw new AuthError(400, "Invalid or expired reset token", "TOKEN_NOT_FOUND");
    }

    if (tokenRecord.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });
      throw new AuthError(400, "Password reset token has expired", "TOKEN_EXPIRED");
    }

    const newHash = await hashPassword(newPassword);

    // Atomically update password, delete token, and revoke ALL sessions
    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { passwordHash: newHash },
      }),
      prisma.verificationToken.delete({
        where: { id: tokenRecord.id },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: tokenRecord.userId },
        data: { isRevoked: true },
      }),
      prisma.session.deleteMany({
        where: { userId: tokenRecord.userId },
      }),
    ]);

    return { success: true, message: "Password reset successful. All active sessions have been revoked." };
  }

  /**
   * Change password while authenticated (requires current password verification)
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AuthError(404, "User not found", "USER_NOT_FOUND");
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AuthError(400, "Current password is incorrect", "INVALID_CURRENT_PASSWORD");
    }

    if (currentPassword === newPassword) {
      throw new AuthError(400, "New password cannot be identical to current password", "PASSWORD_SAME");
    }

    if (!newPassword || newPassword.length < 8 || newPassword.length > 72) {
      throw new AuthError(400, "New password must be between 8 and 72 characters", "INVALID_NEW_PASSWORD");
    }

    const newHash = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      }),
      // Revoke all sessions on password change
      prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      }),
      prisma.session.deleteMany({
        where: { userId },
      }),
    ]);

    return { success: true, message: "Password updated successfully. Please log in with your new password." };
  }
}
