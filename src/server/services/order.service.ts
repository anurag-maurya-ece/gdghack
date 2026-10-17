import { prisma } from "../lib/db";
import { OrderStatus, UserRole } from "@prisma/client";

export class OrderServiceError extends Error {
  constructor(public statusCode: number, message: string, public code: string) {
    super(message);
    this.name = "OrderServiceError";
  }
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderInput {
  customerId: string;
  vendorId: string;
  items: OrderItemInput[];
  deliveryAddress?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  idempotencyKey?: string;
}

// In-memory idempotency cache for duplicate request prevention
const idempotencyStore = new Map<string, string>();

export class OrderService {
  /**
   * Create an order with items and auto-initialize chat inside a transaction
   * Includes idempotency check
   */
  static async createOrder(input: CreateOrderInput) {
    if (!input.items || input.items.length === 0) {
      throw new OrderServiceError(400, "Order must contain at least one item", "EMPTY_ORDER");
    }

    // Check idempotency
    if (input.idempotencyKey && idempotencyStore.has(input.idempotencyKey)) {
      const existingOrderId = idempotencyStore.get(input.idempotencyKey)!;
      const existingOrder = await prisma.order.findUnique({
        where: { id: existingOrderId },
        include: { items: true },
      });
      if (existingOrder) {
        return existingOrder;
      }
    }

    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerId: input.customerId,
          vendorId: input.vendorId,
          status: OrderStatus.PLACED,
          totalAmount,
          deliveryNotes: input.deliveryAddress || input.notes || "Standard delivery",
        },
      });

      await tx.orderItem.createMany({
        data: input.items.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      // Auto-initialize customer-vendor auto-translated chat
      await tx.chat.create({
        data: {
          orderId: createdOrder.id,
          customerId: input.customerId,
          vendorId: input.vendorId,
        },
      });

      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: { items: true },
      });
    });

    if (!order) {
      throw new OrderServiceError(500, "Failed to create order", "TRANSACTION_FAILED");
    }

    if (input.idempotencyKey) {
      idempotencyStore.set(input.idempotencyKey, order.id);
    }

    return order;
  }

  /**
   * Enforce order state machine: PLACED -> ACCEPTED/REJECTED -> READY -> COMPLETED
   */
  static async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    actorId: string,
    actorRole: UserRole
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { vendor: true },
    });

    if (!order) {
      throw new OrderServiceError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    // Verify actor permission (must be order customer, vendor owner, or admin)
    const isVendorOwner = order.vendor.userId === actorId;
    const isCustomer = order.customerId === actorId;
    const isAdmin = actorRole === UserRole.ADMIN;

    if (!isVendorOwner && !isCustomer && !isAdmin) {
      throw new OrderServiceError(403, "Access denied: unauthorized to update this order", "FORBIDDEN");
    }

    // Valid state transitions matching Prisma schema OrderStatus enum
    const current = order.status;
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PLACED]: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED],
      [OrderStatus.ACCEPTED]: [OrderStatus.ENROUTE, OrderStatus.CANCELLED],
      [OrderStatus.ENROUTE]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[current]?.includes(newStatus)) {
      throw new OrderServiceError(
        400,
        `Invalid order status transition from ${current} to ${newStatus}`,
        "INVALID_STATUS_TRANSITION"
      );
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { items: true },
    });
  }

  /**
   * Get order by ID with IDOR authorization protection
   */
  static async getOrderById(orderId: string, actorId: string, actorRole: UserRole) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        vendor: { include: { user: true } },
        customer: true,
      },
    });

    if (!order) {
      throw new OrderServiceError(404, "Order not found", "ORDER_NOT_FOUND");
    }

    const isCustomer = order.customerId === actorId;
    const isVendorOwner = order.vendor.userId === actorId;
    const isAdmin = actorRole === UserRole.ADMIN;

    if (!isCustomer && !isVendorOwner && !isAdmin) {
      throw new OrderServiceError(403, "Access denied: unauthorized to view this order", "FORBIDDEN");
    }

    return order;
  }

  /**
   * List orders for a user (as customer or as vendor)
   */
  static async listUserOrders(userId: string, role: UserRole) {
    if (role === UserRole.VENDOR) {
      const vendor = await prisma.vendor.findUnique({ where: { userId } });
      if (!vendor) return [];
      return prisma.order.findMany({
        where: { vendorId: vendor.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    return prisma.order.findMany({
      where: { customerId: userId },
      include: { items: { include: { product: true } }, vendor: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
