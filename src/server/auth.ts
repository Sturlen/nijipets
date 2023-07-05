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
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
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
          return {
            id: existing_user.id.toString(),
            name: existing_user.username,
          } as User;
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

export interface DiscordProfile extends Record<string, unknown> {
  accent_color: number;
  avatar: string;
  banner: string;
  banner_color: string;
  discriminator: string;
  flags: number;
  id: string;
  image_url: string;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  public_flags: number;
  username: string;
  verified: boolean;
}

/**
 * Customized Discord provider which does not request email
 */
function Discord<P extends DiscordProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "discord",
    name: "Discord",
    type: "oauth",
    authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    token: "https://discord.com/api/oauth2/token",
    userinfo: "https://discord.com/api/users/@me",
    profile(profile) {
      if (profile.avatar === null) {
        const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }
      return {
        id: profile.id,
        name: profile.username,
        image: profile.image_url,
      };
    },
    style: {
      logo: "/discord.svg",
      logoDark: "/discord-dark.svg",
      bg: "#fff",
      text: "#7289DA",
      bgDark: "#7289DA",
      textDark: "#fff",
    },
    options,
  };
}
