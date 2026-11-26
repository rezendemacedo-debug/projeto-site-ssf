import { eq, lt } from "drizzle-orm";
import type { Database } from "../db/client";
import { type EmailCode, emailCodes } from "../db/schema";

export class EmailCodeRepository {
  constructor(private readonly db: Database) {}

  async create(code: EmailCode) {
    // Remove pedidos vencidos há mais de um dia; o cadastro não deixa lixo acumular.
    await this.db.delete(emailCodes).where(lt(emailCodes.expiresAt, new Date(Date.now() - 86_400_000)));
    await this.db.insert(emailCodes).values(code);
  }

  find(tokenHash: string) {
    return this.db.select().from(emailCodes).where(eq(emailCodes.tokenHash, tokenHash)).get();
  }

  async update(tokenHash: string, changes: Partial<Omit<EmailCode, "tokenHash" | "userId">>) {
    await this.db.update(emailCodes).set(changes).where(eq(emailCodes.tokenHash, tokenHash));
  }
}
