import type { Config } from "drizzle-kit";
import { z } from "zod";
import "dotenv/config";
// import { env } from "~/env.mjs";

const connectionString = z.string().url().parse(process.env.DATABASE_URL);

if (!connectionString) {
  throw new Error("'DATABASE_URL' env variable is required");
}

export default {
  schema: "./src/server/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString,
  },
} satisfies Config;
