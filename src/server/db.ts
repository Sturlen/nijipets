import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { env } from "process";
import type { PetData } from "~/types";
import { pets } from "./schema";
import { eq } from "drizzle-orm";

// create the connection
const connection = connect({
  url: env.DATABASE_URL,
});

export const db = drizzle(connection);

export async function petbyOwnerId(userId: string) {
  const pets_result: PetData[] = await db
    .select()
    .from(pets)
    .where(eq(pets.owner, userId));
  return pets_result;
}
