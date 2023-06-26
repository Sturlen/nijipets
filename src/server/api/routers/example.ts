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

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const allUsers = await db.select().from(users);
      console.log(allUsers);
      return {
        greeting: `${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
