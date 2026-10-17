import argon2 from "argon2";

// Constant dummy hash to simulate verify time when user is not found (prevents timing attacks)
const DUMMY_HASH =
  "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzb21lc2FsdA$R3g1k7e7Wv1v1Y8M8f+E+A+0+1+2+3+4+5+6+7+8+90";

/**
 * Hash password with Argon2id using OWASP-recommended parameters
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

/**
 * Constant-time verification of password against Argon2id hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Execute dummy verification to normalize timing when an email is not found
 */
export async function dummyVerifyPassword(password: string): Promise<boolean> {
  try {
    await argon2.verify(DUMMY_HASH, password);
  } catch {
    // Ignore
  }
  return false;
}
