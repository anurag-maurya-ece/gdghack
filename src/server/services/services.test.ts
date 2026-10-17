import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "../lib/db";
import { UserRole, OrderStatus } from "@prisma/client";
import { AuthService } from "../auth/service";
import { VendorService } from "./vendor.service";
import { LocationService } from "./location.service";
import { ProductService } from "./product.service";
import { OrderService, OrderServiceError } from "./order.service";
import { DemandService } from "./demand.service";

describe("Phase 4: Domain Feature Services (Vendor, Location, Product, Order, Demand)", () => {
  let customerUser: any;
  let vendorUser1: any;
  let vendorUser2: any;
  let vendor1: any;
  let vendor2: any;

  beforeAll(async () => {
    process.env.JWT_SECRET = "super_secret_jwt_key_at_least_32_chars_long_123";
    process.env.JWT_REFRESH_SECRET = "super_secret_refresh_jwt_key_at_least_32_chars_456";
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/tech_thela_test?schema=public";
  });

  beforeEach(async () => {
    await prisma.demandPing.deleteMany();
    await prisma.demandCell.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.location.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.session.deleteMany();
    await prisma.review.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create Customer
    const custRes = await AuthService.signup({
      email: "cust.svc@example.com",
      phone: "+919876543111",
      name: "Aman Gupta",
      password: "Password123!",
      role: UserRole.CUSTOMER,
    });
    customerUser = custRes.user;

    // 2. Create Vendor 1
    const v1Res = await AuthService.signup({
      email: "vendor1.svc@example.com",
      phone: "+919876543222",
      name: "Ramesh Kumar",
      password: "Password123!",
      role: UserRole.VENDOR,
    });
    vendorUser1 = v1Res.user;

    vendor1 = await VendorService.createOrUpdateVendor({
      userId: vendorUser1.id,
      shopName: "Ramesh Sabzi Thela",
      category: "Vegetables",
      bio: "Fresh local vegetables daily",
      isActive: true,
    });

    // 3. Create Vendor 2
    const v2Res = await AuthService.signup({
      email: "vendor2.svc@example.com",
      phone: "+919876543333",
      name: "Suresh Fruit Corner",
      password: "Password123!",
      role: UserRole.VENDOR,
    });
    vendorUser2 = v2Res.user;

    vendor2 = await VendorService.createOrUpdateVendor({
      userId: vendorUser2.id,
      shopName: "Suresh Fresh Fruits",
      category: "Fruits",
      bio: "Organic seasonal fruits",
      isActive: true,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ==========================================
  // 1. VENDOR SERVICE TESTS
  // ==========================================
  describe("1. Vendor Profile & Nearby Discovery", () => {
    it("should retrieve vendor by ID or phone with location and products", async () => {
      const foundById = await VendorService.getVendorById(vendor1.id);
      expect(foundById?.shopName).toBe("Ramesh Sabzi Thela");

      const foundByPhone = await VendorService.getVendorByPhone("+919876543222");
      expect(foundByPhone?.id).toBe(vendor1.id);
    });

    it("should discover nearby active vendors sorted by Haversine distance", async () => {
      // Vendor 1 at Connaught Place (28.6304, 77.2177) ~ 0 km away
      await LocationService.updateLocation(vendor1.id, {
        latitude: 28.6304,
        longitude: 77.2177,
        isOnline: true,
      });

      // Vendor 2 in Noida (28.5355, 77.3910) ~ 20 km away
      await LocationService.updateLocation(vendor2.id, {
        latitude: 28.5355,
        longitude: 77.3910,
        isOnline: true,
      });

      // Customer querying from Connaught Place (radius 5000m)
      const nearby = await VendorService.listNearbyVendors({
        latitude: 28.6304,
        longitude: 77.2177,
        radiusMeters: 5000,
      });

      expect(nearby.length).toBe(1);
      expect(nearby[0].id).toBe(vendor1.id);
      expect(nearby[0].distanceMeters).toBeLessThan(100);
    });

    it("should exclude inactive / offline vendors from nearby discovery", async () => {
      await LocationService.updateLocation(vendor1.id, {
        latitude: 28.6304,
        longitude: 77.2177,
        isOnline: false, // OFF
      });

      const nearby = await VendorService.listNearbyVendors({
        latitude: 28.6304,
        longitude: 77.2177,
        radiusMeters: 5000,
      });

      expect(nearby.length).toBe(0);
    });
  });

  // ==========================================
  // 2. LOCATION SERVICE & STALE DECAY
  // ==========================================
  describe("2. Location Service & Hard Constraints (Offline Decay)", () => {
    it("should update location and mark vendor online", async () => {
      const loc = await LocationService.updateLocation(vendor1.id, {
        latitude: 28.6320,
        longitude: 77.2180,
        heading: 90,
        speed: 1.5,
        accuracy: 5.0,
        isOnline: true,
      });

      expect(loc.isOnline).toBe(true);
      expect(loc.latitude).toBeCloseTo(28.632, 3);
    });

    it("should automatically decay stale locations older than N minutes to offline", async () => {
      // Set location updated 30 minutes in the past
      const pastDate = new Date(Date.now() - 30 * 60 * 1000);
      await prisma.location.upsert({
        where: { vendorId: vendor1.id },
        update: {
          latitude: 28.6304,
          longitude: 77.2177,
          updatedAt: pastDate,
        },
        create: {
          vendorId: vendor1.id,
          latitude: 28.6304,
          longitude: 77.2177,
          updatedAt: pastDate,
        },
      });

      await prisma.vendor.update({
        where: { id: vendor1.id },
        data: { isOnline: true },
      });

      const decayedCount = await LocationService.decayStaleLocations(15);
      expect(decayedCount).toBeGreaterThanOrEqual(1);

      const updatedVendor = await prisma.vendor.findUnique({ where: { id: vendor1.id } });
      expect(updatedVendor?.isOnline).toBe(false);
    });
  });

  // ==========================================
  // 3. PRODUCT SERVICE & VOICE LISTING
  // ==========================================
  describe("3. Product Catalog & Structured Voice Product Listing", () => {
    it("should bulk create products from structured voice JSON (F2 Voice Listing)", async () => {
      const voiceProducts = [
        { name: "Aloo (Potato)", price: 20, unit: "kg", inStock: true, category: "Vegetables" },
        { name: "Pyaaz (Onion)", price: 35, unit: "kg", inStock: true, category: "Vegetables" },
        { name: "Tamatar (Tomato)", price: 40, unit: "kg", inStock: true, category: "Vegetables" },
      ];

      const created = await ProductService.bulkCreateProducts(vendor1.id, voiceProducts);
      expect(created.count).toBe(3);

      const products = await ProductService.listVendorProducts(vendor1.id);
      expect(products.length).toBe(3);
      expect(products.map((p) => p.name)).toContain("Aloo (Potato)");
    });

    it("should allow product owner to update product and delete product", async () => {
      const product = await ProductService.createProduct(vendor1.id, {
        name: "Bhindi (Okra)",
        price: 30,
        unit: "kg",
      });

      // Update product
      const updated = await ProductService.updateProduct(product.id, vendor1.id, {
        price: 35,
        inStock: false,
      });
      expect(updated.price).toBe(35);
      expect(updated.inStock).toBe(false);

      // Delete product
      await ProductService.deleteProduct(product.id, vendor1.id);
      const remaining = await ProductService.listVendorProducts(vendor1.id);
      expect(remaining.find((p) => p.id === product.id)).toBeUndefined();

      // 404 on non-existent product
      await expect(
        ProductService.updateProduct("non_existent_product_id", vendor1.id, { price: 50 })
      ).rejects.toThrow(/Product not found/);

      await expect(
        ProductService.deleteProduct("non_existent_product_id", vendor1.id)
      ).rejects.toThrow(/Product not found/);
    });

    it("should reject product update by non-owner vendor (IDOR)", async () => {
      const prod = await ProductService.createProduct(vendor1.id, {
        name: "Guava",
        price: 50,
        unit: "kg",
      });

      await expect(
        ProductService.updateProduct(prod.id, vendor2.id, { price: 60 })
      ).rejects.toThrow(/Access denied: you do not own this product/);
    });
  });

  // ==========================================
  // 4. ORDER SERVICE & STATE MACHINE
  // ==========================================
  describe("4. Order Lifecycle, Atomicity & Idempotency", () => {
    let testProduct: any;

    beforeEach(async () => {
      testProduct = await ProductService.createProduct(vendor1.id, {
        name: "Mangoes",
        price: 100,
        unit: "kg",
      });
    });

    it("should place order atomically in transaction with items and idempotency key", async () => {
      const orderData = {
        customerId: customerUser.id,
        vendorId: vendor1.id,
        items: [{ productId: testProduct.id, quantity: 2, unitPrice: 100 }],
        deliveryAddress: "Flat 402, Sunshine Apts, Connaught Place",
        latitude: 28.6304,
        longitude: 77.2177,
        idempotencyKey: "idem_order_unique_key_001",
      };

      const order = await OrderService.createOrder(orderData);
      expect(order.status).toBe(OrderStatus.PLACED);
      expect(order.totalAmount).toBe(200);
      expect(order.items.length).toBe(1);

      // Replaying same idempotency key must return existing order without creating duplicate
      const duplicateAttempt = await OrderService.createOrder(orderData);
      expect(duplicateAttempt.id).toBe(order.id);

      const totalOrdersInDb = await prisma.order.count();
      expect(totalOrdersInDb).toBe(1);
    });

    it("should enforce valid state transitions: PLACED -> ACCEPTED -> ENROUTE -> DELIVERED", async () => {
      const order = await OrderService.createOrder({
        customerId: customerUser.id,
        vendorId: vendor1.id,
        items: [{ productId: testProduct.id, quantity: 1, unitPrice: 100 }],
        deliveryAddress: "Gate 1",
      });

      // 1. PLACED -> ACCEPTED
      const accepted = await OrderService.updateOrderStatus(order.id, OrderStatus.ACCEPTED, vendorUser1.id, UserRole.VENDOR);
      expect(accepted.status).toBe(OrderStatus.ACCEPTED);

      // 2. ACCEPTED -> ENROUTE
      const enroute = await OrderService.updateOrderStatus(order.id, OrderStatus.ENROUTE, vendorUser1.id, UserRole.VENDOR);
      expect(enroute.status).toBe(OrderStatus.ENROUTE);

      // 3. ENROUTE -> DELIVERED
      const delivered = await OrderService.updateOrderStatus(order.id, OrderStatus.DELIVERED, customerUser.id, UserRole.CUSTOMER);
      expect(delivered.status).toBe(OrderStatus.DELIVERED);
    });

    it("should reject illegal state transitions (e.g. PLACED -> DELIVERED or CANCELLED -> ENROUTE)", async () => {
      const order = await OrderService.createOrder({
        customerId: customerUser.id,
        vendorId: vendor1.id,
        items: [{ productId: testProduct.id, quantity: 1, unitPrice: 100 }],
        deliveryAddress: "Gate 1",
      });

      // Illegal: PLACED directly to DELIVERED
      await expect(
        OrderService.updateOrderStatus(order.id, OrderStatus.DELIVERED, vendorUser1.id, UserRole.VENDOR)
      ).rejects.toThrow(/Invalid order status transition/);

      // Cancel the order
      await OrderService.updateOrderStatus(order.id, OrderStatus.CANCELLED, vendorUser1.id, UserRole.VENDOR);

      // Illegal: CANCELLED to ENROUTE
      await expect(
        OrderService.updateOrderStatus(order.id, OrderStatus.ENROUTE, vendorUser1.id, UserRole.VENDOR)
      ).rejects.toThrow(/Invalid order status transition/);
    });

    it("should prevent unauthorized users from viewing an order (IDOR)", async () => {
      const order = await OrderService.createOrder({
        customerId: customerUser.id,
        vendorId: vendor1.id,
        items: [{ productId: testProduct.id, quantity: 1, unitPrice: 100 }],
        deliveryAddress: "Gate 1",
      });

      // Vendor 2 (unrelated party) attempts to inspect order
      await expect(
        OrderService.getOrderById(order.id, vendorUser2.id, UserRole.VENDOR)
      ).rejects.toThrow(/Access denied/);

      // List user orders for customer and vendor
      const customerOrders = await OrderService.listUserOrders(customerUser.id, UserRole.CUSTOMER);
      expect(customerOrders.length).toBe(1);

      const vendorOrders = await OrderService.listUserOrders(vendorUser1.id, UserRole.VENDOR);
      expect(vendorOrders.length).toBe(1);
    });

    it("should toggle vendor online status explicitly", async () => {
      const toggled = await VendorService.toggleOnlineStatus(vendor1.id, false);
      expect(toggled.isOnline).toBe(false);

      const reToggled = await VendorService.toggleOnlineStatus(vendor1.id, true);
      expect(reToggled.isOnline).toBe(true);
    });
  });

  // ==========================================
  // 5. DEMAND SERVICE & PREDICTIVE ROUTING
  // ==========================================
  describe("5. Demand Service & Community Predictive Routing (F7)", () => {
    it("should record customer demand pings and return top suggested zones", async () => {
      // Customer pings for chai / snacks near Connaught Place
      await DemandService.recordDemandPing({
        userId: customerUser.id,
        latitude: 28.6304,
        longitude: 77.2177,
        category: "Chai & Snacks",
        item: "Kulhad Chai",
        quantity: "2 cups",
        notes: "Near Metro Gate 2",
      });

      const zones = await DemandService.getSuggestedZones("Chai & Snacks");
      expect(zones.length).toBeGreaterThan(0);
      expect(zones[0].reason).toBeDefined();
      expect(zones[0].demandScore).toBeGreaterThan(0);
    });
  });
});

