import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "../src/server/db/client";

await migrate(db, { migrationsFolder: "./drizzle" });
console.log("Banco atualizado.");
