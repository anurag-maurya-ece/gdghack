import { NextRequest } from "next/server";
import { OrderService, OrderServiceError } from "@/server/services/order.service";
import { extractAuthToken, apiSuccess, apiError } from "@/server/auth/rbac";
import { verifyAccessToken } from "@/server/auth/tokens";
import { OrderStatus, UserRole } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = extractAuthToken(request);
    if (!token) {
      return apiError(401, "UNAUTHORIZED", "Authentication required");
    }

    const payload = await verifyAccessToken(token);
    if (!payload?.sub) {
      return apiError(401, "INVALID_TOKEN", "Session invalid");
    }

    const order = await OrderService.getOrderById(id, payload.sub, payload.role as UserRole);
    return apiSuccess({ order });
  } catch (error: any) {
    if (error instanceof OrderServiceError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", error.message);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, actorId, actorRole } = body;

    let resolvedActorId = actorId;
    let resolvedActorRole = actorRole || UserRole.VENDOR;

    const token = extractAuthToken(request);
    if (token) {
      const payload = await verifyAccessToken(token);
      if (payload?.sub) {
        resolvedActorId = payload.sub;
        resolvedActorRole = payload.role as UserRole;
      }
    }

    if (!resolvedActorId) {
      return apiError(401, "UNAUTHORIZED", "Actor identification required");
    }

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return apiError(400, "INVALID_STATUS", `Valid statuses: ${Object.values(OrderStatus).join(", ")}`);
    }

    const updated = await OrderService.updateOrderStatus(
      id,
      status as OrderStatus,
      resolvedActorId,
      resolvedActorRole
    );

    return apiSuccess({ order: updated });
  } catch (error: any) {
    if (error instanceof OrderServiceError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
