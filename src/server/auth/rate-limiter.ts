interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
  lastAttemptAt: number;
}

class MemoryRateLimiter {
  private attempts = new Map<string, AttemptRecord>();
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes window

  /**
   * Check if a key (e.g. `ip:1.2.3.4` or `account:user@example.com`) is currently locked
   */
  isLocked(key: string): { locked: boolean; remainingMs: number } {
    const record = this.attempts.get(key);
    if (!record || !record.lockedUntil) {
      return { locked: false, remainingMs: 0 };
    }

    const now = Date.now();
    if (now < record.lockedUntil) {
      return { locked: true, remainingMs: record.lockedUntil - now };
    }

    // Lockout expired: reset lock
    record.lockedUntil = null;
    return { locked: false, remainingMs: 0 };
  }

  /**
   * Record a failed attempt and apply progressive lockout if threshold reached
   */
  recordFailedAttempt(key: string): { locked: boolean; remainingMs: number } {
    const now = Date.now();
    let record = this.attempts.get(key);

    if (!record || now - record.lastAttemptAt > this.windowMs) {
      record = { count: 1, lockedUntil: null, lastAttemptAt: now };
    } else {
      record.count += 1;
      record.lastAttemptAt = now;
    }

    // Progressive lockout policy
    if (record.count >= 10) {
      // 15-minute lock
      record.lockedUntil = now + 15 * 60 * 1000;
    } else if (record.count >= 5) {
      // 5-minute lock
      record.lockedUntil = now + 5 * 60 * 1000;
    }

    this.attempts.set(key, record);

    if (record.lockedUntil && record.lockedUntil > now) {
      return { locked: true, remainingMs: record.lockedUntil - now };
    }
    return { locked: false, remainingMs: 0 };
  }

  /**
   * Clear attempts on successful authentication
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const authRateLimiter = new MemoryRateLimiter();
