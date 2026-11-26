import { desc, eq } from "drizzle-orm";
import type { Database } from "../db/client";
import { type NewUser, type User, users } from "../db/schema";

/** Tudo, exceto o hash da senha. */
const PUBLIC_COLUMNS = {
  id: users.id, name: users.name, email: users.email, city: users.city, motivation: users.motivation,
  title: users.title, givenName: users.givenName, familyName: users.familyName, phone: users.phone,
  address: users.address, addressLine2: users.addressLine2, state: users.state, postalCode: users.postalCode,
  country: users.country, jewishStatus: users.jewishStatus, sex: users.sex, birthDate: users.birthDate,
  shabbatCity: users.shabbatCity, tier: users.tier, emailVerifiedAt: users.emailVerifiedAt,
  role: users.role, status: users.status, createdAt: users.createdAt,
};

/** Campos que o próprio membro preenche no perfil. */
export type ProfileFields = Partial<Pick<User,
  "title" | "phone" | "address" | "addressLine2" | "city" | "state" | "postalCode" | "country" |
  "jewishStatus" | "sex" | "birthDate" | "shabbatCity" | "tier">>;

export class UserRepository {
  constructor(private readonly db: Database) {}

  findById(id: string) {
    return this.db.select(PUBLIC_COLUMNS).from(users).where(eq(users.id, id)).get();
  }

  findByEmail(email: string) {
    return this.db.select().from(users).where(eq(users.email, email)).get();
  }

  async create(user: NewUser) {
    const rows = await this.db.insert(users).values(user).onConflictDoNothing().returning({ id: users.id });
    return rows.length > 0;
  }

  list() {
    return this.db.select(PUBLIC_COLUMNS).from(users).orderBy(desc(users.createdAt)).limit(500);
  }

  async updateProfile(id: string, profile: ProfileFields) {
    await this.db.update(users).set(profile).where(eq(users.id, id));
  }

  async markEmailVerified(id: string, at: Date) {
    await this.db.update(users).set({ emailVerifiedAt: at }).where(eq(users.id, id));
  }

  async delete(id: string) {
    await this.db.delete(users).where(eq(users.id, id));
  }

  async setStatus(id: string, status: User["status"]) {
    await this.db.update(users).set({ status }).where(eq(users.id, id));
  }
}
