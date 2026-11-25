import { desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { type Message, messages } from "../db/schema";

export class MessageRepository {
  constructor(private readonly db: Database) {}

  async create(data: Pick<Message, "name" | "email" | "subject" | "body">) {
    await this.db.insert(messages).values({ ...data, id: crypto.randomUUID(), createdAt: new Date() });
  }

  list() {
    return this.db.select().from(messages).orderBy(desc(messages.createdAt)).limit(200);
  }

  async markRead(id: string) {
    await this.db.update(messages).set({ readAt: new Date() }).where(eq(messages.id, id));
  }
}
