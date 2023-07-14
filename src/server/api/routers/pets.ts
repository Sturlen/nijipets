import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { pets } from "~/server/schema";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { DefaultPet, type PetData } from "~/types";
import { TRPCError } from "@trpc/server";

export const petRouter = createTRPCRouter({
  petbyOwnerId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const result = await db.select().from(pets).where(eq(pets.owner, input));
    const firstPet = result[0];
    if (firstPet) {
      const pet_data: PetData = {
        color: firstPet.color || DefaultPet.color,
        glasses: firstPet.glasses || DefaultPet.glasses,
      };
      return pet_data;
    } else {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        color: z.string().startsWith("#").length(7),
        glasses: z.number().int().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      console.log("Color", input, userId);

      const result = await db.select().from(pets).where(eq(pets.owner, userId));
      const existing_pet = result[0];

      if (existing_pet) {
        await db.update(pets).set(input).where(eq(pets.owner, userId));
        console.log("existing", input, userId);
      } else {
        await db.insert(pets).values({
          name: "goon",
          color: input.color,
          glasses: input.glasses,
          owner: userId,
        });
        console.log("new", input, userId);
      }
    }),

  all: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).nullish(),
          cursor: z.number().int().min(0).nullish(),
        })
        .transform(({ limit, cursor }) => ({
          limit: limit ?? 10,
          cursor: cursor ?? 0,
        }))
    )
    .query(async ({ input: { limit, cursor } }) => {
      limit; // for pagination
      cursor;
      const all_pets: PetData[] = await db.select().from(pets);
      return all_pets;
    }),

  listByOwner: publicProcedure
    .input(z.object({ ownerUserId: z.string() }))
    .query(async ({ input: { ownerUserId } }) => {
      const pets_result: PetData[] = await db
        .select()
        .from(pets)
        .where(eq(pets.owner, ownerUserId));
      return pets_result;
    }),
});
