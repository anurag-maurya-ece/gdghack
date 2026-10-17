import { NextRequest, NextResponse } from "next/server";
import { VendorService } from "@/server/services/vendor.service";
import { ProductService } from "@/server/services/product.service";
import { prisma } from "@/server/lib/db";
import { INITIAL_VENDORS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    if (id || phone) {
      let vendor = id
        ? await VendorService.getVendorById(id)
        : await VendorService.getVendorByPhone(phone!);

      // Graceful fallback to demo vendor store if not yet seeded in DB
      if (!vendor) {
        const mockVendor = INITIAL_VENDORS.find(
          (v) => (id && v.id === id) || (phone && v.phone === phone)
        );
        if (mockVendor) {
          return NextResponse.json({ success: true, vendor: mockVendor });
        }
        return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, vendor });
    }

    const vendors = await prisma.vendor.findMany({
      include: { location: true, products: true, user: true },
      take: 50,
    });

    if (vendors.length === 0) {
      return NextResponse.json({ success: true, vendors: INITIAL_VENDORS });
    }

    return NextResponse.json({ success: true, vendors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, inventory, isActive, name, shopName, category } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    // Upsert User for vendor identity
    const user = await prisma.user.upsert({
      where: { phone },
      update: {
        name: name || "Vendor Partner",
      },
      create: {
        phone,
        email: `${phone.replace(/\D/g, "")}@thela.local`,
        name: name || "Vendor Partner",
        passwordHash: "$dummy_hash_for_vendor$",
        role: "VENDOR",
      },
    });

    const vendor = await VendorService.createOrUpdateVendor({
      userId: user.id,
      shopName: shopName || "Apna Thela",
      category: category || "Vegetables",
      isActive: isActive !== undefined ? isActive : true,
    });

    // If inventory provided, save products
    if (inventory && Array.isArray(inventory) && inventory.length > 0) {
      const formattedItems = inventory.map((i: any) => ({
        name: i.name || i.item,
        price: Number(i.price) || 0,
        unit: i.unit || "kg",
        inStock: i.inStock !== undefined ? i.inStock : true,
      }));
      await ProductService.bulkCreateProducts(vendor.id, formattedItems);
    }

    const fullVendor = await VendorService.getVendorById(vendor.id);
    return NextResponse.json({ success: true, vendor: fullVendor });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
