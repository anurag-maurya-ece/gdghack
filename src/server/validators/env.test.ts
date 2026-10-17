import { describe, it, expect } from "vitest";
import { validateEnv, envSchema, getEnv } from "./env";

describe("Environment Validation (Zod Schema)", () => {
  const validEnv = {
    NODE_ENV: "test",
    PORT: "3000",
    DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/tech_thela_test?schema=public",
    JWT_SECRET: "this_is_a_very_long_32_char_secret_key_12345",
    JWT_REFRESH_SECRET: "this_is_another_long_32_char_refresh_secret_key_67890",
    APP_URL: "http://localhost:3000",
  };

  it("should successfully parse valid environment variables", () => {
    const parsed = validateEnv(validEnv);
    expect(parsed.PORT).toBe(3000);
    expect(parsed.NODE_ENV).toBe("test");
    expect(parsed.DATABASE_URL).toContain("postgres");
    expect(parsed.JWT_SECRET.length).toBeGreaterThanOrEqual(32);
  });

  it("should throw a fatal error when DATABASE_URL is missing", () => {
    const invalidEnv = { ...validEnv, DATABASE_URL: "" };
    expect(() => validateEnv(invalidEnv)).toThrow(/DATABASE_URL is required/);
  });

  it("should throw error when JWT_SECRET is less than 32 characters", () => {
    const invalidEnv = { ...validEnv, JWT_SECRET: "short_secret" };
    expect(() => validateEnv(invalidEnv)).toThrow(/JWT_SECRET must be at least 32 characters long/);
  });

  it("should throw error when JWT_REFRESH_SECRET is less than 32 characters", () => {
    const invalidEnv = { ...validEnv, JWT_REFRESH_SECRET: "short_refresh" };
    expect(() => validateEnv(invalidEnv)).toThrow(/JWT_REFRESH_SECRET must be at least 32 characters long/);
  });

  it("should coerce string ports to numbers", () => {
    const envWithPort = { ...validEnv, PORT: "8080" };
    const parsed = validateEnv(envWithPort);
    expect(parsed.PORT).toBe(8080);
    expect(typeof parsed.PORT).toBe("number");
  });

  it("should reject invalid NODE_ENV values", () => {
    const invalidEnv = { ...validEnv, NODE_ENV: "invalid_env" };
    expect(() => validateEnv(invalidEnv)).toThrow();
  });

  it("should return cached validatedEnv from getEnv()", () => {
    validateEnv(validEnv);
    const env = getEnv();
    expect(env).toBeDefined();
    expect(env.DATABASE_URL).toBe(validEnv.DATABASE_URL);
  });

  it("should initialize from process.env if getEnv() called directly", () => {
    process.env.DATABASE_URL = validEnv.DATABASE_URL;
    process.env.JWT_SECRET = validEnv.JWT_SECRET;
    process.env.JWT_REFRESH_SECRET = validEnv.JWT_REFRESH_SECRET;
    const env = getEnv();
    expect(env.DATABASE_URL).toBe(validEnv.DATABASE_URL);
  });
});
