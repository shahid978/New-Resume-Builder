import "server-only";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "@/lib/config/env";
import * as schema from "./schema";

/**
 * Neon Postgres connection pool + Drizzle instance (server-only).
 *
 * Neon's serverless driver works on plain Node.js deployments (Cloudways,
 * Vercel, etc.) without needing a local Postgres process or pg binary.
 * Connections are pooled per process and are not exposed externally.
 */
function createDatabase() {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    min: 0,
  });
  return drizzle(pool, { schema });
}

type Database = ReturnType<typeof createDatabase>;
let database: Database | undefined;
function getDatabase() {
  database ??= createDatabase();
  return database;
}

// Keep credentials and pool creation at request time so `next build` can run
// in CI without production secrets.
export const db = new Proxy({} as Database, {
  get(_target, property) {
    const instance = getDatabase();
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
