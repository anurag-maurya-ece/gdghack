export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { OrderService, OrderServiceError } from "@/server/services/order.service";
import { extractAuthToken, apiSuccess, apiError } from "@/server/auth/rbac";
import { verifyAccessToken } from "@/server/auth/tokens";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, vendorId, items, deliveryAddress, notes, idempotencyKey } = body;

    let resolvedCustomerId = customerId;

    // If authenticated via cookie/bearer, infer customerId
    const token = extractAuthToken(request);
    if (token) {
      const payload = await verifyAccessToken(token);
      if (payload?.sub) {
        resolvedCustomerId = payload.sub;
      }
    }

    if (!resolvedCustomerId || !vendorId || !items || !Array.isArray(items)) {
      return apiError(400, "INVALID_INPUT", "customerId, vendorId, and items array are required");
    }

    const order = await OrderService.createOrder({
      customerId: resolvedCustomerId,
      vendorId,
      items,
      deliveryAddress,
      notes,
      idempotencyKey,
    });

    return apiSuccess({ order }, 201);
  } catch (error: any) {
    if (error instanceof OrderServiceError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", error.message);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = extractAuthToken(request);
    if (!token) {
      return apiError(401, "UNAUTHORIZED", "Authentication required to view orders");
    }

    const payload = await verifyAccessToken(token);
    if (!payload?.sub) {
      return apiError(401, "INVALID_TOKEN", "Session invalid");
    }

    const orders = await OrderService.listUserOrders(payload.sub, payload.role as UserRole);
    return apiSuccess({ orders });
  } catch (error: any) {
    return apiError(500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
