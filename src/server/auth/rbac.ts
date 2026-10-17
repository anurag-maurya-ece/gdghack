import { NextRequest, NextResponse } from "next/server";
import { UserRole, User } from "@prisma/client";
import { verifyAccessToken, AccessTokenPayload } from "./tokens";
import { prisma } from "../lib/db";

export class AuthContextError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = "AuthContextError";
  }
}

export interface AuthenticatedContext {
  user: {
    id: string;
    email: string;
    role: UserRole;
    phone: string;
    name: string;
    isBanned: boolean;
    emailVerified: boolean;
  };
  payload: AccessTokenPayload;
}

/**
 * Extract token from Authorization header or cookies
 */
export function extractAuthToken(req: Request | NextRequest): string | null {
  // 1. Check Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }

  // 2. Check Cookie header
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith("access_token=")) {
        const token = cookie.substring("access_token=".length).trim();
        if (token) return decodeURIComponent(token);
      }
    }
  }

  return null;
}

/**
 * Enforce authentication on API route handler
 */
export async function requireAuth(req: Request | NextRequest): Promise<AuthenticatedContext> {
  const token = extractAuthToken(req);
  if (!token) {
    throw new AuthContextError(401, "Authentication required: No token provided", "UNAUTHORIZED");
  }

  const payload = await verifyAccessToken(token);
  if (!payload || !payload.sub) {
    throw new AuthContextError(401, "Invalid or expired session token", "INVALID_TOKEN");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      role: true,
      phone: true,
      name: true,
      isBanned: true,
      emailVerified: true,
    },
  });

  if (!user) {
    throw new AuthContextError(401, "User account no longer exists", "USER_NOT_FOUND");
  }

  if (user.isBanned) {
    throw new AuthContextError(403, "Account has been suspended or deactivated", "ACCOUNT_BANNED");
  }

  return { user, payload };
}

/**
 * Enforce specific role-based access control (RBAC)
 */
export async function requireRole(
  req: Request | NextRequest,
  allowedRoles: UserRole[]
): Promise<AuthenticatedContext> {
  const ctx = await requireAuth(req);

  // If user is ADMIN, grant access unless restricted
  if (ctx.user.role === UserRole.ADMIN) {
    return ctx;
  }

  if (!allowedRoles.includes(ctx.user.role)) {
    throw new AuthContextError(
      403,
      `Forbidden: Insufficient permissions. Required roles: ${allowedRoles.join(", ")}`,
      "INSUFFICIENT_ROLE"
    );
  }

  return ctx;
}

/**
 * Enforce resource-level ownership to prevent IDOR attacks
 */
export function assertOwnership(
  currentUserId: string,
  resourceOwnerId: string,
  currentUserRole?: UserRole
): void {
  // Admin bypass
  if (currentUserRole === UserRole.ADMIN) {
    return;
  }

  if (currentUserId !== resourceOwnerId) {
    throw new AuthContextError(
      403,
      "Access denied: you do not have permission to access this resource",
      "IDOR_FORBIDDEN"
    );
  }
}

/**
 * Standardized API response wrappers
 */
export function apiSuccess<T>(data: T, status: number = 200, headers?: HeadersInit) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status, headers }
  );
}

export function apiError(
  statusCode: number,
  code: string,
  message: string,
  details?: any,
  headers?: HeadersInit
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status: statusCode, headers }
  );
}
