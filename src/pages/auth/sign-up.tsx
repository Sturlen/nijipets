import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { push } = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const sign_up_submit = async () => {
    const auth_params = new URLSearchParams();
    auth_params.set("sign-up", "true");
    const res = await signIn(
      "credentials",
      {
        username: username,
        password: password,
        redirect: false,
      },
      auth_params
    );
    if (res?.error) {
      console.error("signup fail", res.error, res.url);
    } else if (res?.ok) {
      console.log("Signup success");
      await push(res.url || "/");
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
          void sign_up_submit();
        }}
      >
        <h1 className="mb-4 text-xl">Sign up to Nijipets</h1>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label className="mb-4 font-bold">
          Username
          <input
            name="username"
            type="text"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block border-spacing-1 border-2"
          />
        </label>
        <button type="submit" className="rounded-sm border">
          Sign Up
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
