import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CredentialsSchema, createNewUser, db } from "~/server/db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { $path } from "next-typesafe-url";

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
      name: string;
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
  pages: {
    newUser: $path({ route: "/pets" }),
    signIn: $path({ route: "/auth/sign-in" }),
    error: $path({ route: "/auth/sign-in" }),
    signOut: $path({ route: "/" }),
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
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
      async authorize(raw_credentials, _req) {
        console.log("AUTH BEGIN", _req.query, raw_credentials);
        const credentials = CredentialsSchema.parse(raw_credentials);

        const result = await db
          .select()
          .from(users)
          .where(eq(users.username, credentials.username));
        const existing_user = result[0];

        if (_req.query?.["sign-up"]) {
          console.log("[SIGNUP]");
          if (existing_user) {
            console.log("Signup failed: User Already Exists");
            throw new Error("UserExists");
          }
        }

        if (existing_user) {
          console.log("user already exists");

          if (existing_user.password_hash === credentials.password) {
            return {
              id: existing_user.id,
              name: existing_user.username,
              email: null,
            } as User;
          } else {
            console.log("wrong password");
            return null;
          }
        } else {
          const user = await createNewUser(credentials);

          console.log("newly created user returned");

          return {
            id: user.id,
            name: user.name,
            email: null,
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
