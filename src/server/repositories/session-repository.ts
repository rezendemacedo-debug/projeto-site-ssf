import { eq, lt } from "drizzle-orm";
import type { Database } from "../db/client";
import { sessions, users } from "../db/schema";

export class SessionRepository {
  constructor(private readonly db: Database) {}

  async create(tokenHash: string, userId: string, expiresAt: Date) {
    await this.db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
    await this.db.insert(sessions).values({ tokenHash, userId, expiresAt });
  }

  find(tokenHash: string) {
    return this.db
      .select({ user: users, expiresAt: sessions.expiresAt })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(eq(sessions.tokenHash, tokenHash))
      .get();
  }

  async delete(tokenHash: string) {
    await this.db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  }
}
