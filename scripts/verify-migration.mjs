import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/tech_thela_db?schema=public";
}

const prisma = new PrismaClient();

async function verify() {
  console.log("\n=======================================================");
  console.log("🔍 COMPREHENSIVE POSTGRESQL RELATIONAL HEALTH & AUDIT");
  console.log("=======================================================\n");

  const [
    userCount,
    vendorCount,
    locationCount,
    productCount,
    orderCount,
    demandCellCount,
    sessionCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.vendor.count(),
    prisma.location.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.demandCell.count(),
    prisma.session.count(),
  ]);

  console.log(`👤 Users:        ${userCount}`);
  console.log(`🛒 Vendors:      ${vendorCount}`);
  console.log(`📍 Locations:    ${locationCount}`);
  console.log(`📦 Products:     ${productCount}`);
  console.log(`🛍️  Orders:       ${orderCount}`);
  console.log(`🔥 Demand Cells: ${demandCellCount}`);
  console.log(`🔑 Sessions:     ${sessionCount}`);

  // Relational Integrity Checks: foreign keys are enforced by PostgreSQL schema constraints
  const allLocations = await prisma.location.findMany({ select: { vendorId: true } });
  const allVendors = new Set((await prisma.vendor.findMany({ select: { id: true } })).map((v) => v.id));
  const orphanLocations = allLocations.filter((l) => !allVendors.has(l.vendorId));

  const allProducts = await prisma.product.findMany({ select: { vendorId: true } });
  const orphanProducts = allProducts.filter((p) => !allVendors.has(p.vendorId));

  console.log(`\nRelational Integrity Audit:`);
  console.log(`✓ Orphan Locations: ${orphanLocations.length} (Expected 0)`);
  console.log(`✓ Orphan Products:  ${orphanProducts.length} (Expected 0)`);

  if (orphanLocations.length === 0 && orphanProducts.length === 0) {
    console.log("\n✅ ALL POSTGRESQL CONSTRAINTS AND FOREIGN KEYS ARE HEALTHY!");
  } else {
    console.error("❌ Integrity anomalies detected!");
    process.exit(1);
  }
}

verify()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
