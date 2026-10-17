import { prisma } from "../lib/db";

export class ProductServiceError extends Error {
  constructor(public statusCode: number, message: string, public code: string) {
    super(message);
    this.name = "ProductServiceError";
  }
}

export interface CreateProductInput {
  name: string;
  price: number;
  unit: string;
  inStock?: boolean;
  category?: string;
}

export class ProductService {
  /**
   * Create a single product under a vendor
   */
  static async createProduct(vendorId: string, input: CreateProductInput) {
    return prisma.product.create({
      data: {
        vendorId,
        name: input.name.trim(),
        price: input.price,
        unit: input.unit.trim(),
        inStock: input.inStock !== undefined ? input.inStock : true,
        category: input.category || "Sabzi",
      },
    });
  }

  /**
   * Bulk create products from voice listing structured JSON
   * Fulfills AGENTS.md F2 Voice Product Listing Pipeline
   */
  static async bulkCreateProducts(vendorId: string, items: CreateProductInput[]) {
    const productsData = items.map((item) => ({
      vendorId,
      name: item.name.trim(),
      price: item.price,
      unit: item.unit.trim(),
      inStock: item.inStock !== undefined ? item.inStock : true,
      category: item.category || "Sabzi",
    }));

    return prisma.product.createMany({
      data: productsData,
    });
  }

  /**
   * Update product with vendor ownership validation
   */
  static async updateProduct(
    productId: string,
    vendorId: string,
    input: Partial<CreateProductInput>
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ProductServiceError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    if (product.vendorId !== vendorId) {
      throw new ProductServiceError(403, "Access denied: you do not own this product", "PRODUCT_FORBIDDEN");
    }

    return prisma.product.update({
      where: { id: productId },
      data: {
        ...(input.name ? { name: input.name.trim() } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.unit ? { unit: input.unit.trim() } : {}),
        ...(input.inStock !== undefined ? { inStock: input.inStock } : {}),
        ...(input.category ? { category: input.category } : {}),
      },
    });
  }

  /**
   * Delete product with vendor ownership validation
   */
  static async deleteProduct(productId: string, vendorId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ProductServiceError(404, "Product not found", "PRODUCT_NOT_FOUND");
    }

    if (product.vendorId !== vendorId) {
      throw new ProductServiceError(403, "Access denied: you do not own this product", "PRODUCT_FORBIDDEN");
    }

    return prisma.product.delete({
      where: { id: productId },
    });
  }

  /**
   * List all products for a given vendor
   */
  static async listVendorProducts(vendorId: string) {
    return prisma.product.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
    });
  }
}
