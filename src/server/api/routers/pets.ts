import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { UserIdSchema, pets } from "~/server/schema";
import { and, eq } from "drizzle-orm";
import { db, petsByOwnerId } from "~/server/db";
import {
  DefaultPetAppearance,
  PetSchema,
  type PetApperance,
  PetIdSchema,
} from "~/types";
import { TRPCError } from "@trpc/server";

export const petRouter = createTRPCRouter({
  petbyOwnerId: publicProcedure.input(UserIdSchema).query(async ({ input }) => {
    const [firstPet] = await db
      .select()
      .from(pets)
      .where(eq(pets.ownerId, input));
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
    .input(PetIdSchema)
    .query(async ({ input: petId }) => {
      const firstPet = await db.query.pets.findFirst({
        where: (pets, { eq }) => eq(pets.id, petId),
        with: { owner: { columns: { id: true, username: true } } },
      });
      if (firstPet) {
        const { id, color, glasses, ...rest } = firstPet;
        console.log("findbyid owner", rest);
        const pet = PetSchema.parse({
          id: id.toString(),
          apperance: { glasses, color },
          ...rest,
        });
        return pet;
      } else {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        id: PetIdSchema,
        color: z.string().startsWith("#").length(7),
        glasses: z.number().int().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, color, glasses } = input;
      const userId = ctx.session.user.id;
      console.log("Color", input, userId);

      await db
        .update(pets)
        .set({ color, glasses })
        .where(and(eq(pets.ownerId, userId), eq(pets.id, id)));
      console.log("Updated existing", input, userId);
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
        ownerId: userId,
      });

      console.log("New Pet Created", input, userId);
    }),

  all: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(10),
        cursor: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input: { limit, cursor } }) => {
      const raw_pets = await db.select().from(pets).limit(limit).offset(cursor);

      const parsed_pets = raw_pets.map(({ id, glasses, color, ...rest }) =>
        PetSchema.parse({
          id: id.toString(),
          apperance: { glasses, color },
          ...rest,
        })
      );
      return parsed_pets;
    }),

  listByOwner: publicProcedure
    .input(z.object({ ownerUserId: UserIdSchema }))
    .query(async ({ input: { ownerUserId } }) => {
      return await petsByOwnerId(ownerUserId);
    }),
});
