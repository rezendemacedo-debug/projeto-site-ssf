import { desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { type User, users } from "../db/schema";

/** Tudo, exceto o hash da senha. */
const PUBLIC_COLUMNS = {
  id: users.id, name: users.name, email: users.email, city: users.city,
  motivation: users.motivation, role: users.role, status: users.status, createdAt: users.createdAt,
};

export class UserRepository {
  constructor(private readonly db: Database) {}

  findByEmail(email: string) {
    return this.db.select().from(users).where(eq(users.email, email)).get();
  }

  async create(user: User) {
    const rows = await this.db.insert(users).values(user).onConflictDoNothing().returning({ id: users.id });
    return rows.length > 0;
  }

  list() {
    return this.db.select(PUBLIC_COLUMNS).from(users).orderBy(desc(users.createdAt)).limit(500);
  }

  async setStatus(id: string, status: User["status"]) {
    await this.db.update(users).set({ status }).where(eq(users.id, id));
  }
}
