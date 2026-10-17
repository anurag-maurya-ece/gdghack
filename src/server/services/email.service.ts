export interface SendEmailInput {
  to: string;
  name: string;
  token: string;
}

export interface SentEmailRecord {
  to: string;
  name: string;
  subject: string;
  html: string;
  sentAt: Date;
}

// In-memory record queue for testing & local development verification
const sentEmailsStore: SentEmailRecord[] = [];

export class EmailService {
  /**
   * Dispatch account email verification link
   */
  static async sendVerificationEmail(input: SendEmailInput) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/verify-email?token=${input.token}`;

    const subject = "WEkreta / Tech Thela — Verify Your Email Address";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Welcome to WEkreta / Tech Thela, ${input.name}!</h2>
        <p>Please confirm your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 16px 0;">
          Verify Email Address
        </a>
        <p style="color: #64748b; font-size: 14px;">This verification link will expire in 24 hours.</p>
        <p style="color: #94a3b8; font-size: 12px;">Token: ${input.token}</p>
      </div>
    `;

    sentEmailsStore.push({
      to: input.to,
      name: input.name,
      subject,
      html,
      sentAt: new Date(),
    });

    return { success: true, message: "Verification email dispatched" };
  }

  /**
   * Dispatch password reset link
   */
  static async sendPasswordResetEmail(input: SendEmailInput) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${input.token}`;

    const subject = "WEkreta / Tech Thela — Reset Your Password";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ea580c;">Password Reset Request</h2>
        <p>Hello ${input.name},</p>
        <p>We received a request to reset your Tech Thela account password. Click below to choose a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 14px;">This single-use link will expire in 1 hour. If you did not request this, please ignore this email.</p>
        <p style="color: #94a3b8; font-size: 12px;">Token: ${input.token}</p>
      </div>
    `;

    sentEmailsStore.push({
      to: input.to,
      name: input.name,
      subject,
      html,
      sentAt: new Date(),
    });

    return { success: true, message: "Password reset email dispatched" };
  }

  /**
   * Test harness inspect utility
   */
  static getSentEmails(): SentEmailRecord[] {
    return [...sentEmailsStore];
  }

  /**
   * Clear test harness email queue
   */
  static clearSentEmails(): void {
    sentEmailsStore.length = 0;
  }
}
