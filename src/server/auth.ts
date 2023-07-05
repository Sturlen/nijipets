import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type User,
} from "next-auth";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  events: {
    linkAccount(message) {
      const { user } = message;
      console.log(`[USER:LINK] id: ${user.id} name?: ${user.name || ""}`);
    },
    signIn(message) {
      const { user } = message;
      console.log(`[USER:SIGNIN] id: ${user.id} name?: ${user.name || ""} `);
    },
    signOut(message) {
      const { session, token } = message;
      console.log(
        `[USER:SIGNOUT] id: ${token.name || ""} name?: ${
          session?.user.name || ""
        }`
      );
    },
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Username",
          type: "text",
          required: "required",
          placeholder: "jsmith",
          tooltip: "Case Sensitive. Choose wisely.",
        },
        password: { label: "Password", type: "password", required: "required" },
      },
      async authorize(credentials, _req) {
        if (!credentials) {
          throw new Error("No credentials");
        }

        if (
          credentials.username.length === 0 ||
          credentials.password.length === 0
        ) {
          return null;
        }
        // Add logic here to look up the user from the credentials supplied
        const result = await db
          .select()
          .from(users)
          .where(eq(users.username, credentials.username));
        const existing_user = result[0];

        if (existing_user) {
          console.log("user already exists");

          if (existing_user.password_hash === credentials.password) {
            return {
              id: existing_user.id.toString(),
              name: existing_user.username,
            } as User;
          } else {
            return null;
          }
        } else {
          console.log("user does not already exists, creating");
          await db.insert(users).values({
            username: credentials.username,
            password_hash: credentials.password,
          });
          console.log("fetch newly created user");
          const result = await db
            .select()
            .from(users)
            .where(eq(users.username, credentials.username));
          const user = result[0];

          if (!user) {
            throw new Error("DB ERROR");
          }

          console.log("newly created user returned");

          return {
            id: user.id.toString(),
            name: user.username,
          } as User;
        }
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
