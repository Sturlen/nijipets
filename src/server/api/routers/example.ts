import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { users } from "~/server/schema";
import { env } from "~/env.mjs";

// create the connection
const connection = connect({
  url: env.DATABASE_URL,
});

const db = drizzle(connection);

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      await db.insert(users).values({ name: "" + Math.random() });
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
