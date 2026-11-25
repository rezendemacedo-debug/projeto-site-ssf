import { sql } from "drizzle-orm";
import type { Database } from "../db/client";
import { rateLimits } from "../db/schema";

/** Janela fixa persistida no banco: funciona com várias instâncias do servidor. */
export class RateLimiter {
  constructor(private readonly db: Database) {}

  async allow(key: string, max: number, windowSeconds: number) {
    const now = Math.floor(Date.now() / 1000);
    const reset = new Date((now + windowSeconds) * 1000);
    const row = await this.db
      .insert(rateLimits)
      .values({ key, count: 1, resetAt: reset })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: {
          count: sql`case when ${rateLimits.resetAt} <= ${now} then 1 else ${rateLimits.count} + 1 end`,
          resetAt: sql`case when ${rateLimits.resetAt} <= ${now} then ${now + windowSeconds} else ${rateLimits.resetAt} end`,
        },
      })
      .returning({ count: rateLimits.count })
      .get();
    return row.count <= max;
  }
}
