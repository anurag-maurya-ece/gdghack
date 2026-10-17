import { NextRequest, NextResponse } from "next/server";
import { ProductService, ProductServiceError } from "@/server/services/product.service";
import { apiSuccess, apiError } from "@/server/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendorId");

    if (!vendorId) {
      return apiError(400, "VENDOR_ID_REQUIRED", "vendorId query parameter is required");
    }

    const products = await ProductService.listVendorProducts(vendorId);
    return apiSuccess({ products });
  } catch (error: any) {
    return apiError(500, "INTERNAL_SERVER_ERROR", error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendorId, products, name, price, unit, inStock, category } = body;

    if (!vendorId) {
      return apiError(400, "VENDOR_ID_REQUIRED", "vendorId is required");
    }

    // Support bulk creation (e.g. from voice listing)
    if (products && Array.isArray(products)) {
      const result = await ProductService.bulkCreateProducts(vendorId, products);
      return apiSuccess({ count: result.count, message: "Products created successfully" }, 201);
    }

    if (!name || price === undefined || !unit) {
      return apiError(400, "INVALID_INPUT", "name, price, and unit are required");
    }

    const product = await ProductService.createProduct(vendorId, {
      name,
      price: Number(price),
      unit,
      inStock,
      category,
    });

    return apiSuccess({ product }, 201);
  } catch (error: any) {
    if (error instanceof ProductServiceError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
