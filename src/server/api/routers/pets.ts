import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { pets, users } from "~/server/schema";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { DefaultPet, PetData } from "~/types";
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

  pet: protectedProcedure
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
});
