import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters long"),
  APP_URL: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function validateEnv(customEnv?: Record<string, string | undefined>): Env {
  const envToValidate = customEnv || process.env;
  const result = envSchema.safeParse(envToValidate);

  if (!result.success) {
    const issues = result.error.issues || [];
    const errorDetails = issues
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");
    const errorMessage = `❌ [CRITICAL FATAL] Environment validation failed on startup:\n${errorDetails}`;
    
    // If called with customEnv (e.g. in test suites), throw so test can catch and verify
    if (customEnv) {
      throw new Error(errorMessage);
    }
    
    console.error(errorMessage);
    process.exit(1);
  }

  validatedEnv = result.data;
  return validatedEnv;
}

export function getEnv(): Env {
  if (!validatedEnv) {
    return validateEnv();
  }
  return validatedEnv;
}
