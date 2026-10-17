export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { StorageService, StorageError } from "@/server/services/storage.service";
import { requireAuth, apiSuccess, apiError, AuthContextError } from "@/server/auth/rbac";

export async function POST(request: NextRequest) {
  try {
    const ctx = await requireAuth(request);
    const body = await request.json();
    const { fileName, contentType, sizeBytes } = body;

    if (!fileName || !contentType || !sizeBytes) {
      return apiError(400, "INVALID_INPUT", "fileName, contentType, and sizeBytes are required");
    }

    const presigned = await StorageService.generatePresignedUploadUrl({
      userId: ctx.user.id,
      fileName,
      contentType,
      sizeBytes: Number(sizeBytes),
    });

    return apiSuccess({ presigned });
  } catch (error: any) {
    if (error instanceof AuthContextError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    if (error instanceof StorageError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    return apiError(500, "INTERNAL_SERVER_ERROR", error.message);
  }
}
