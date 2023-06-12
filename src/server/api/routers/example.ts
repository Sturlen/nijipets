import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { pets, users } from "~/server/schema";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";

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

  petbyOwnerId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const result = await db.select().from(pets).where(eq(pets.owner, input));

    return result[0];
  }),

  pet: protectedProcedure
    .input(z.string().startsWith("#").length(7))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      console.log("Color", input, userId);

      const result = await db.select().from(pets).where(eq(pets.owner, userId));
      const existing_pet = result[0];

      if (existing_pet) {
        await db
          .update(pets)
          .set({ color: input })
          .where(eq(pets.owner, userId));
        console.log("existing", input, userId);
      } else {
        await db
          .insert(pets)
          .values({ name: "goon", color: input, owner: userId });
        console.log("new", input, userId);
      }
    }),
});
