import { describe, it, expect, beforeEach } from "vitest";
import { StorageService, StorageError } from "./storage.service";
import { EmailService } from "./email.service";

describe("Phase 5: Storage (S3/R2 Presigned URLs) & Email Dispatch Services", () => {
  beforeEach(() => {
    EmailService.clearSentEmails();
  });

  // ==========================================
  // 1. STORAGE SERVICE (S3/R2 PRESIGNED UPLOADS)
  // ==========================================
  describe("1. Storage Service & Presigned Upload Validation", () => {
    const testUserId = "user_vendor_12345";

    it("should generate a secure presigned upload URL for allowed image types", async () => {
      const result = await StorageService.generatePresignedUploadUrl({
        userId: testUserId,
        fileName: "thela-fresh-vegetables.jpg",
        contentType: "image/jpeg",
        sizeBytes: 1024 * 500, // 500 KB
      });

      expect(result.uploadUrl).toBeDefined();
      expect(result.fileUrl).toBeDefined();
      expect(result.key).toContain(`uploads/${testUserId}/`);
      expect(result.key).toMatch(/\.jpg$/);
      expect(result.headers["Content-Type"]).toBe("image/jpeg");
    });

    it("should reject unallowed or malicious content types", async () => {
      // HTML/Script
      await expect(
        StorageService.generatePresignedUploadUrl({
          userId: testUserId,
          fileName: "malicious.html",
          contentType: "text/html",
          sizeBytes: 1024,
        })
      ).rejects.toThrow(/Invalid or unsupported content type/);

      // Executable
      await expect(
        StorageService.generatePresignedUploadUrl({
          userId: testUserId,
          fileName: "hack.exe",
          contentType: "application/x-msdownload",
          sizeBytes: 1024,
        })
      ).rejects.toThrow(/Invalid or unsupported content type/);
    });

    it("should reject files exceeding maximum quota size (5MB)", async () => {
      await expect(
        StorageService.generatePresignedUploadUrl({
          userId: testUserId,
          fileName: "giant-photo.png",
          contentType: "image/png",
          sizeBytes: 6 * 1024 * 1024, // 6 MB
        })
      ).rejects.toThrow(/File size exceeds maximum allowed limit/);
    });

    it("should enforce user namespace isolation in key generation", async () => {
      const userA = "user_A_111";
      const userB = "user_B_222";

      const resA = await StorageService.generatePresignedUploadUrl({
        userId: userA,
        fileName: "avatar.png",
        contentType: "image/png",
        sizeBytes: 10000,
      });

      const resB = await StorageService.generatePresignedUploadUrl({
        userId: userB,
        fileName: "avatar.png",
        contentType: "image/png",
        sizeBytes: 10000,
      });

      expect(resA.key.startsWith(`uploads/${userA}/`)).toBe(true);
      expect(resB.key.startsWith(`uploads/${userB}/`)).toBe(true);
      expect(resA.key).not.toBe(resB.key);
    });
  });

  // ==========================================
  // 2. EMAIL SERVICE
  // ==========================================
  describe("2. Email Dispatch Service (Verification & Password Reset)", () => {
    it("should format and dispatch verification email", async () => {
      const res = await EmailService.sendVerificationEmail({
        to: "vendor.ramesh@example.com",
        name: "Ramesh Kumar",
        token: "raw_verification_token_abc_123",
      });

      expect(res.success).toBe(true);
      const sent = EmailService.getSentEmails();
      expect(sent.length).toBe(1);
      expect(sent[0].to).toBe("vendor.ramesh@example.com");
      expect(sent[0].subject).toContain("Verify Your Email");
      expect(sent[0].html).toContain("raw_verification_token_abc_123");
    });

    it("should format and dispatch password reset email", async () => {
      const res = await EmailService.sendPasswordResetEmail({
        to: "customer.aman@example.com",
        name: "Aman Gupta",
        token: "raw_reset_token_xyz_789",
      });

      expect(res.success).toBe(true);
      const sent = EmailService.getSentEmails();
      expect(sent.length).toBe(1);
      expect(sent[0].to).toBe("customer.aman@example.com");
      expect(sent[0].subject).toContain("Reset Your Password");
      expect(sent[0].html).toContain("raw_reset_token_xyz_789");
    });
  });
});
