import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { env } from "process";

import { users } from "./schema";
import * as schema from "./schema";

import { z } from "zod";
import type { User } from "next-auth";
import { createId } from "@paralleldrive/cuid2";
import { eq, sql } from "drizzle-orm";

// create the connection
const connection = connect({
  url: env.DATABASE_URL,
});

export const db = drizzle(connection, { schema });
export type DB_TYPE = typeof db;

export const CredentialsSchema = z
  .object({
    username: z.string().nonempty(),
    password: z.string().nonempty(),
  })
  .brand("Credentials");

export type Credentials = z.infer<typeof CredentialsSchema>;

export async function createNewUser(credentials: Credentials) {
  try {
    console.log("Creating new User with username:", credentials.username);

    const id = createId();

    const user = schema.insertUserSchema.parse({
      id: id,
      username: credentials.username,
      password_hash: credentials.password,
    });

    await db.insert(users).values(user);

    return {
      id: user.id,
      name: user.username,
      email: null,
    } as User;
  } catch (error) {
    console.error("User creation failed for username:", credentials.username);
    if (error instanceof Error) {
      console.error(error.name, error.message);
      throw error;
    } else {
      throw new Error("createNewUser");
    }
  }
}

export async function authorizeExistingUser(a: string) {
  await Promise.resolve();
  return a;
}

export async function incrementCoins(
  db: DB_TYPE,
  userId: string,
  amount: number
) {
  return await db
    .update(users)
    .set({ coins: sql`${users.coins} + ${amount}` })
    .where(eq(users.id, userId));
}
