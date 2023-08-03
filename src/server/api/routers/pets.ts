import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { pets } from "~/server/schema";
import { eq } from "drizzle-orm";
import { db, petbyOwnerId } from "~/server/db";
import { DefaultPetAppearance, type PetApperance } from "~/types";
import { TRPCError } from "@trpc/server";

export const petRouter = createTRPCRouter({
  petbyOwnerId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const [firstPet] = await db
      .select()
      .from(pets)
      .where(eq(pets.owner, input));
    if (firstPet) {
      const pet_data: PetApperance = {
        color: firstPet.color || DefaultPetAppearance.color,
        glasses: firstPet.glasses || DefaultPetAppearance.glasses,
      };
      return pet_data;
    } else {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
  }),

  findById: publicProcedure
    .input(z.number({ coerce: true }).int().min(0))
    .query(async ({ input: petId }) => {
      const [firstPet] = await db.select().from(pets).where(eq(pets.id, petId));
      if (firstPet) {
        const pet_data: PetApperance = {
          color: firstPet.color || DefaultPetAppearance.color,
          glasses: firstPet.glasses || DefaultPetAppearance.glasses,
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
  create: protectedProcedure
    .input(
      z.object({
        color: z.string().startsWith("#").length(7),
        glasses: z.number().int().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      await db.insert(pets).values({
        name: "goon",
        color: input.color,
        glasses: input.glasses,
        owner: userId,
      });

      console.log("New Pet Created", input, userId);
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
      const all_pets: PetApperance[] = await db
        .select()
        .from(pets)
        .limit(limit)
        .offset(cursor);
      return all_pets;
    }),

  listByOwner: publicProcedure
    .input(z.object({ ownerUserId: z.string() }))
    .query(async ({ input: { ownerUserId } }) => {
      return await petbyOwnerId(ownerUserId);
    }),
});
