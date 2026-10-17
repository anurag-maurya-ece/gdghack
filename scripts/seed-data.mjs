import { PrismaClient } from "@prisma/client";
import { INITIAL_VENDORS } from "../lib/mock-data.js";
import argon2 from "argon2";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/tech_thela_db?schema=public";
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding PostgreSQL database with realistic Tech Thela data...");

  const passwordHash = await argon2.hash("Password123!", {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  // 1. Seed Customer User
  const customer = await prisma.user.upsert({
    where: { email: "customer@techthela.ai" },
    update: { name: "Mr. Oberoi" },
    create: {
      email: "customer@techthela.ai",
      phone: "+919811122233",
      name: "Mr. Oberoi",
      passwordHash,
      role: "CUSTOMER",
      emailVerified: true,
    },
  });
  console.log(`✅ Seeded Customer: ${customer.name} (${customer.email})`);

  // 2. Seed Vendors, Locations & Products
  let vendorCount = 0;
  let productCount = 0;

  for (const v of INITIAL_VENDORS) {
    const rawPhone = (v.phone || "9876543210").replace(/\s+/g, "");

    // Upsert User
    const user = await prisma.user.upsert({
      where: { phone: rawPhone },
      update: { name: v.name },
      create: {
        email: `${rawPhone.replace(/\D/g, "")}@thela.local`,
        phone: rawPhone,
        name: v.name,
        passwordHash,
        role: "VENDOR",
        emailVerified: true,
      },
    });

    // Upsert Vendor
    const vendor = await prisma.vendor.upsert({
      where: { userId: user.id },
      update: {
        shopName: v.shopName,
        shopType: v.category || "Sabzi",
        isOnline: v.isOnline ?? true,
        rating: v.rating || 4.8,
        reviewsCount: v.reviewsCount || 50,
      },
      create: {
        userId: user.id,
        shopName: v.shopName,
        shopType: v.category || "Sabzi",
        isOnline: v.isOnline ?? true,
        rating: v.rating || 4.8,
        reviewsCount: v.reviewsCount || 50,
      },
    });
    vendorCount++;

    // Upsert Location
    await prisma.location.upsert({
      where: { vendorId: vendor.id },
      update: {
        latitude: v.lat || 28.6304,
        longitude: v.lng || 77.2177,
      },
      create: {
        vendorId: vendor.id,
        latitude: v.lat || 28.6304,
        longitude: v.lng || 77.2177,
      },
    });

    // Seed Inventory Products
    if (v.inventory && Array.isArray(v.inventory)) {
      for (const item of v.inventory) {
        const existing = await prisma.product.findFirst({
          where: { vendorId: vendor.id, name: item.name },
        });

        if (!existing) {
          await prisma.product.create({
            data: {
              vendorId: vendor.id,
              name: item.name,
              price: Number(item.price),
              unit: item.unit || "kg",
              inStock: item.inStock !== undefined ? item.inStock : true,
              category: v.category || "Sabzi",
            },
          });
          productCount++;
        }
      }
    }
  }

  console.log(`✅ Seeded ${vendorCount} Vendors and ${productCount} Products.`);

  // 3. Seed Predictive Demand Hotspot Cells (AGENTS.md F7)
  const demandHotspots = [
    {
      cellHash: "cell_connaught_place",
      latitude: 28.6304,
      longitude: 77.2177,
      score: 95,
      peakHours: "4:30 PM - 7:30 PM",
      reason: "High office crowd demand for evening Chai & Snacks",
    },
    {
      cellHash: "cell_dwarka_sec14",
      latitude: 28.5983,
      longitude: 77.0319,
      score: 84,
      peakHours: "5:00 PM - 8:30 PM",
      reason: "Residential evening rush for fresh vegetables & fruits",
    },
    {
      cellHash: "cell_noida_sec18",
      latitude: 28.5708,
      longitude: 77.326,
      score: 78,
      peakHours: "1:00 PM - 3:30 PM",
      reason: "Market shopper and student snack requests",
    },
  ];

  for (const cell of demandHotspots) {
    await prisma.demandCell.upsert({
      where: { cellHash: cell.cellHash },
      update: {
        score: cell.score,
        peakHours: cell.peakHours,
        reason: cell.reason,
      },
      create: cell,
    });
  }
  console.log(`✅ Seeded ${demandHotspots.length} Predictive Demand Cells.`);
  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
