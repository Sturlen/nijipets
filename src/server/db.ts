import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { env } from "process";
import type { PetApperance } from "~/types";
import { pets, users } from "./schema";
import * as schema from "./schema";
import { eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import type { User } from "next-auth";

// create the connection
const connection = connect({
  url: env.DATABASE_URL,
});

export const db = drizzle(connection, { schema });

export async function petsByOwnerId(userId: number) {
  const { color, glasses } = getTableColumns(pets);
  const pets_result: PetApperance[] = await db
    .select({ color, glasses })
    .from(pets)
    .where(eq(pets.ownerId, userId));
  return pets_result;
}

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

    await db.insert(users).values({
      username: credentials.username,
      password_hash: credentials.password,
    });
    console.log("fetch newly created user", credentials.username);
    const { id, username } = getTableColumns(users);
    const [user] = await db
      .select({ id, username })
      .from(users)
      .where(eq(users.username, credentials.username));

    if (!user) {
      throw new Error("Could not fetch newly created user");
    }

    return {
      id: user.id.toString(),
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
