import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  city: text().notNull().default(""),
  motivation: text().notNull().default(""),
  title: text().notNull().default(""),
  givenName: text().notNull().default(""),
  familyName: text().notNull().default(""),
  phone: text().notNull().default(""),
  address: text().notNull().default(""),
  addressLine2: text().notNull().default(""),
  state: text().notNull().default(""),
  postalCode: text().notNull().default(""),
  country: text().notNull().default(""),
  jewishStatus: text().notNull().default(""),
  sex: text().notNull().default(""),
  birthDate: text().notNull().default(""),
  shabbatCity: text().notNull().default(""),
  tier: text().notNull().default(""),
  emailVerifiedAt: integer({ mode: "timestamp" }),
  role: text({ enum: ["member", "admin"] }).notNull().default("member"),
  status: text({ enum: ["pending", "active", "blocked"] }).notNull().default("pending"),
  createdAt: integer({ mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    /** SHA-256 do token; o token em si só existe no cookie. */
    tokenHash: text().primaryKey(),
    userId: text().notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer({ mode: "timestamp" }).notNull(),
  },
  (t) => [index("sessions_user").on(t.userId)],
);

/** Código de 6 dígitos enviado por e-mail no cadastro. O navegador guarda só o token da etapa. */
export const emailCodes = sqliteTable(
  "email_codes",
  {
    /** SHA-256 do token do cookie que acompanha as etapas do cadastro. */
    tokenHash: text().primaryKey(),
    userId: text().notNull().references(() => users.id, { onDelete: "cascade" }),
    /** HMAC do código; o código em si só existe no e-mail. */
    codeHash: text().notNull(),
    expiresAt: integer({ mode: "timestamp" }).notNull(),
    attempts: integer().notNull().default(0),
    sentAt: integer({ mode: "timestamp" }).notNull(),
    verifiedAt: integer({ mode: "timestamp" }),
  },
  (t) => [index("email_codes_user").on(t.userId)],
);

export const savedLessons = sqliteTable(
  "saved_lessons",
  {
    userId: text().notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: text().notNull(),
    kind: text({ enum: ["favorite", "watched"] }).notNull(),
    createdAt: integer({ mode: "timestamp" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId, t.kind] })],
);

export const messages = sqliteTable("messages", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  subject: text().notNull(),
  body: text().notNull(),
  readAt: integer({ mode: "timestamp" }),
  createdAt: integer({ mode: "timestamp" }).notNull(),
});

export const rateLimits = sqliteTable("rate_limits", {
  key: text().primaryKey(),
  count: integer().notNull(),
  resetAt: integer({ mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type EmailCode = typeof emailCodes.$inferSelect;
export type SavedKind = (typeof savedLessons.$inferSelect)["kind"];
