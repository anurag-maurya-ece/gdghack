import { SignJWT, jwtVerify } from "jose";
import crypto from "node:crypto";
import { getEnv } from "../validators/env";
import { UserRole } from "@prisma/client";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  sessionId: string;
}

/**
 * Generate SHA-256 hash of a raw token string for secure database storage
 */
export function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Generate cryptographically secure random token
 */
export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Sign short-lived Access JWT (15 minutes)
 */
export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  const env = getEnv();
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  return new SignJWT({
    email: payload.email,
    role: payload.role,
    sessionId: payload.sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

/**
 * Verify Access JWT. Rejects invalid, expired, tampered, or alg:none tokens.
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const env = getEnv();
    const secret = new TextEncoder().encode(env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!payload.sub || !payload.email || !payload.role || !payload.sessionId) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email as string,
      role: payload.role as UserRole,
      sessionId: payload.sessionId as string,
    };
  } catch {
    return null;
  }
}
