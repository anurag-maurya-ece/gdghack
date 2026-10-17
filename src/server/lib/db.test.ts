import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "./db";

const testPrisma = prisma;

describe("PostgreSQL + Prisma Relational Integrity & Schema Constraints", () => {
  beforeAll(async () => {
    // Clean test database tables in reverse relational order
    await testPrisma.review.deleteMany();
    await testPrisma.demandPing.deleteMany();
    await testPrisma.message.deleteMany();
    await testPrisma.chat.deleteMany();
    await testPrisma.orderItem.deleteMany();
    await testPrisma.order.deleteMany();
    await testPrisma.product.deleteMany();
    await testPrisma.location.deleteMany();
    await testPrisma.vendor.deleteMany();
    await testPrisma.verificationToken.deleteMany();
    await testPrisma.refreshToken.deleteMany();
    await testPrisma.session.deleteMany();
    await testPrisma.user.deleteMany();
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("should create and retrieve a user with hashed password", async () => {
    const user = await testPrisma.user.create({
      data: {
        email: "test.vendor@example.com",
        phone: "+919988776655",
        name: "Ramesh Kumar",
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$dummyhash",
        role: "VENDOR",
      },
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("test.vendor@example.com");
    expect(user.role).toBe("VENDOR");

    const fetched = await testPrisma.user.findUnique({
      where: { id: user.id },
    });
    expect(fetched?.name).toBe("Ramesh Kumar");
  });

  it("should enforce unique constraint on user email (P2002)", async () => {
    await expect(
      testPrisma.user.create({
        data: {
          email: "test.vendor@example.com", // Duplicate email
          phone: "+919988776656",
          name: "Duplicate User",
          passwordHash: "hash123",
          role: "CUSTOMER",
        },
      })
    ).rejects.toThrow();
  });

  it("should enforce unique constraint on user phone (P2002)", async () => {
    await expect(
      testPrisma.user.create({
        data: {
          email: "unique.email@example.com",
          phone: "+919988776655", // Duplicate phone
          name: "Duplicate Phone User",
          passwordHash: "hash123",
          role: "CUSTOMER",
        },
      })
    ).rejects.toThrow();
  });

  it("should create 1-to-1 vendor profile linked to user", async () => {
    const vendorUser = await testPrisma.user.findUnique({
      where: { email: "test.vendor@example.com" },
    });
    expect(vendorUser).toBeDefined();

    const vendor = await testPrisma.vendor.create({
      data: {
        userId: vendorUser!.id,
        shopName: "Ramesh Fresh Vegetables",
        shopType: "Sabzi",
        language: "hi",
        isOnline: true,
      },
    });

    expect(vendor.id).toBeDefined();
    expect(vendor.userId).toBe(vendorUser!.id);

    // Add location
    const location = await testPrisma.location.create({
      data: {
        vendorId: vendor.id,
        latitude: 28.6139,
        longitude: 77.209,
      },
    });
    expect(location.vendorId).toBe(vendor.id);

    // Add product
    const product = await testPrisma.product.create({
      data: {
        vendorId: vendor.id,
        name: "Fresh Aloo",
        price: 20.0,
        unit: "kg",
      },
    });
    expect(product.vendorId).toBe(vendor.id);
  });

  it("should cascade delete vendor, location, and products when user is deleted", async () => {
    const user = await testPrisma.user.create({
      data: {
        email: "cascade.test@example.com",
        phone: "+919111222333",
        name: "Cascade Vendor",
        passwordHash: "hash",
        role: "VENDOR",
      },
    });

    const vendor = await testPrisma.vendor.create({
      data: {
        userId: user.id,
        shopName: "Cascade Cart",
        shopType: "Phal",
      },
    });

    await testPrisma.location.create({
      data: {
        vendorId: vendor.id,
        latitude: 28.5,
        longitude: 77.1,
      },
    });

    await testPrisma.product.create({
      data: {
        vendorId: vendor.id,
        name: "Kela",
        price: 40.0,
        unit: "dozen",
      },
    });

    // Delete user
    await testPrisma.user.delete({
      where: { id: user.id },
    });

    // Verify vendor, location and product are deleted
    const vendorAfter = await testPrisma.vendor.findUnique({ where: { id: vendor.id } });
    const locationAfter = await testPrisma.location.findUnique({ where: { vendorId: vendor.id } });
    const productsAfter = await testPrisma.product.findMany({ where: { vendorId: vendor.id } });

    expect(vendorAfter).toBeNull();
    expect(locationAfter).toBeNull();
    expect(productsAfter.length).toBe(0);
  });
});
