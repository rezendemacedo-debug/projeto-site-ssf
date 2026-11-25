import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function createDatabase(url: string, authToken?: string) {
  return drizzle(createClient({ url, authToken: authToken || undefined }), { schema });
}

export type Database = ReturnType<typeof createDatabase>;

export const db = createDatabase(process.env.DATABASE_URL ?? "file:./ssf.db", process.env.DATABASE_AUTH_TOKEN);
