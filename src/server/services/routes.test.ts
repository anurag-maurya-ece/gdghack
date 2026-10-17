import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "../lib/db";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { GET as getVendorsHandler, POST as postVendorHandler } from "../../../app/api/vendor/route";
import { GET as getNearbyHandler } from "../../../app/api/vendor/nearby/route";
import { POST as updateLocationHandler } from "../../../app/api/vendor/update-location/route";
import { GET as getProductsHandler, POST as postProductsHandler } from "../../../app/api/products/route";
import { POST as postOrderHandler } from "../../../app/api/orders/route";
import { POST as postPingHandler } from "../../../app/api/ping/create/route";
import { GET as getDemandHandler } from "../../../app/api/demand/route";

describe("Phase 4: Feature Route Handlers Integration", () => {
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
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create vendor profile and retrieve via GET /api/vendor", async () => {
    const postReq = new NextRequest("http://localhost:3000/api/vendor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        phone: "+919876543210",
        name: "Ramesh Kumar",
        shopName: "Ramesh Fresh Thela",
        category: "Vegetables",
        inventory: [{ name: "Aloo", price: 25, unit: "kg" }],
      }),
    });

    const postRes = await postVendorHandler(postReq);
    expect(postRes.status).toBe(200);
    const postJson = await postRes.json();
    expect(postJson.success).toBe(true);
    expect(postJson.vendor.shopName).toBe("Ramesh Fresh Thela");

    // Query by phone
    const getReq = new NextRequest("http://localhost:3000/api/vendor?phone=%2B919876543210");
    const getRes = await getVendorsHandler(getReq);
    expect(getRes.status).toBe(200);
    const getJson = await getRes.json();
    expect(getJson.vendor.phone).toBe("+919876543210");
  });

  it("should update vendor location via POST /api/vendor/update-location", async () => {
    const req = new NextRequest("http://localhost:3000/api/vendor/update-location", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        phone: "+919876543210",
        latitude: 28.6304,
        longitude: 77.2177,
        isActive: true,
      }),
    });

    const res = await updateLocationHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.vendor.isActive).toBe(true);
  });

  it("should return nearby vendors via GET /api/vendor/nearby", async () => {
    const req = new NextRequest("http://localhost:3000/api/vendor/nearby?latitude=28.6304&longitude=77.2177&radius=5000");
    const res = await getNearbyHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.vendors)).toBe(true);
  });

  it("should broadcast a demand ping via POST /api/ping/create", async () => {
    const req = new NextRequest("http://localhost:3000/api/ping/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        item: "Fresh Bananas",
        quantity: "1 Dozen",
        notes: "Shivaji Stadium Gate 1",
        latitude: 28.6304,
        longitude: 77.2177,
      }),
    });

    const res = await postPingHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.pingId).toBeDefined();
  });

  it("should return predictive routing zones via GET /api/demand", async () => {
    const req = new NextRequest("http://localhost:3000/api/demand?category=Sabzi");
    const res = await getDemandHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.zones.length).toBeGreaterThan(0);
  });
});
