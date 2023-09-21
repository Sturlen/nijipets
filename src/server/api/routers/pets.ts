import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import {
  UserIdSchema,
  insertPetSchema,
  pets,
  PetIdSchema,
  users,
} from "~/server/schema";
import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { DefaultPetAppearance, type PetApperance } from "~/types";
import { TRPCError } from "@trpc/server";
import { createId } from "@paralleldrive/cuid2";

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
        const { glasses, color, ...rest } = firstPet;
        console.log("findbyid owner", rest.owner);
        return {
          apperance: { color, glasses },
          ...rest,
        };
      } else {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),

  upsert: protectedProcedure
    .input(insertPetSchema.pick({ id: true, color: true, glasses: true }))
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
    .input(insertPetSchema.pick({ color: true, glasses: true }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const id = createId();
      const pet = insertPetSchema.parse({
        id: id,
        name: "goon",
        color: input.color,
        glasses: input.glasses,
        ownerId: userId,
      });

      await db.insert(pets).values(pet);

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
      const raw_pets = await db.query.pets.findMany({
        limit,
        offset: cursor,
        with: { owner: { columns: { id: true, username: true } } },
      });

      const parsed_pets = raw_pets.map(({ color, glasses, ...rest }) => ({
        apperance: { color, glasses },
        ...rest,
      }));

      return parsed_pets;
    }),

  listByOwner: publicProcedure
    .input(z.object({ ownerUserId: UserIdSchema }))
    .query(async ({ input: { ownerUserId } }) => {
      return await db.query.users.findFirst({
        columns: {},
        where: (users, { eq }) => eq(users.id, ownerUserId),
        with: { pets: true },
      });
    }),

  userHeader: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await db.query.users.findFirst({
      columns: { username: true, coins: true },
      where: (users, { eq }) => eq(users.id, userId),
    });
  }),
  minigameComplete: protectedProcedure.mutation(async ({ ctx }) => {
    // probably need to star a session to verify
    const userId = ctx.session.user.id;
    const coins = (
      await db.query.users.findFirst({
        columns: { coins: true },
        where: (users, { eq }) => eq(users.id, userId),
      })
    )?.coins;
    if (!coins) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    await db
      .update(users)
      .set({ coins: coins + 10 })
      .where(eq(users.id, userId));
  }),
});
