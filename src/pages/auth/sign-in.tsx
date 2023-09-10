import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { $path, type DynamicRoute } from "next-typesafe-url";
import { z } from "zod";
import { useSearchParams } from "~/hooks/router";

const Route = {
  searchParams: z.object({
    callbackUrl: z.string().nullish(),
  }),
} satisfies DynamicRoute;
export type RouteType = typeof Route;

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { push } = useRouter();
  const { data } = useSearchParams(Route.searchParams);

  const callbackUrl = data?.callbackUrl || $path({ route: "/pets" });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const sign_in_submit = async () => {
    const auth_params = new URLSearchParams();
    const res = await signIn(
      "credentials",
      {
        username: username,
        password: password,
        redirect: false,
        callbackUrl,
      },
      auth_params
    );
    if (res?.error) {
      console.error("signin fail", res.error, res.url);
    } else if (res?.ok) {
      console.log("Signin success");
      await push(callbackUrl);
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-slate-500">
      <form
        method="post"
        action="/api/auth/callback/credentials?sign-up=true"
        className="flex flex-col rounded-md bg-white p-8 font-bold"
        onSubmit={(e) => {
          e.preventDefault();
          void sign_in_submit();
        }}
      >
        <h1 className="mb-4 text-xl">Sign in to nijipets</h1>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label className="mb-4 font-bold">
          Username
          <input
            name="username"
            type="text"
            required={true}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block border-spacing-1 border-2"
          />
        </label>
        <label className="mb-4 font-bold">
          Password
          <input
            name="password"
            type="password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block border-spacing-1 border-2"
          />
        </label>
        <button type="submit" className="rounded-sm border">
          Sign in
        </button>
        <span className="mt-4 h-0 border bg-black" />
        <button
          onClick={(e) => {
            e.preventDefault();
            void push(
              $path({ route: "/auth/sign-up", searchParams: { callbackUrl } })
            );
          }}
          className="mt-4 italic text-blue-400 hover:text-blue-300"
        >
          Create account
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
