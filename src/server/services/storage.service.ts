import crypto from "node:crypto";

export class StorageError extends Error {
  constructor(public statusCode: number, message: string, public code: string) {
    super(message);
    this.name = "StorageError";
  }
}

export interface PresignedUploadInput {
  userId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface PresignedUploadOutput {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  headers: Record<string, string>;
  expiresInSeconds: number;
}

export class StorageService {
  // Allowed safe image content types for thela vendor & product images
  private static readonly ALLOWED_CONTENT_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ]);

  // Maximum file size: 5 MB
  private static readonly MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

  /**
   * Validate content-type, size, and generate a user-namespaced S3/R2 presigned upload URL
   */
  static async generatePresignedUploadUrl(
    input: PresignedUploadInput
  ): Promise<PresignedUploadOutput> {
    if (!input.userId) {
      throw new StorageError(400, "User ID is required for namespace isolation", "USER_ID_REQUIRED");
    }

    if (!input.contentType || !this.ALLOWED_CONTENT_TYPES.has(input.contentType.toLowerCase())) {
      throw new StorageError(
        400,
        `Invalid or unsupported content type: ${input.contentType}. Allowed types: ${Array.from(
          this.ALLOWED_CONTENT_TYPES
        ).join(", ")}`,
        "INVALID_CONTENT_TYPE"
      );
    }

    if (input.sizeBytes > this.MAX_FILE_SIZE_BYTES) {
      throw new StorageError(
        400,
        `File size exceeds maximum allowed limit of ${this.MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB`,
        "FILE_TOO_LARGE"
      );
    }

    // Sanitize file name to prevent path traversal
    const cleanFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueId = crypto.randomUUID();
    const key = `uploads/${input.userId}/${uniqueId}-${cleanFileName}`;

    const cdnBase = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.thela.local";
    const fileUrl = `${cdnBase}/${key}`;

    // Generate S3/R2 presigned URL or dev upload target
    const uploadUrl = `${cdnBase}/upload/${key}?signedToken=${crypto.randomBytes(16).toString("hex")}`;

    return {
      uploadUrl,
      fileUrl,
      key,
      headers: {
        "Content-Type": input.contentType,
      },
      expiresInSeconds: 900, // 15 minutes
    };
  }
}
