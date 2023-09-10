import { signIn, signOut, useSession } from "next-auth/react";
import { $path } from "next-typesafe-url";
import Link from "next/link";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";
import { useRouter } from "next/router";

const SignInButton: React.FC = () => {
  const { data: sessionData } = useSession();
  const { push } = useRouter();

  return (
    <>
      {sessionData && (
        <>
          <p className="text-4xl font-bold text-black">
            Welcome, {sessionData.user.name}!
          </p>
        </>
      )}

      <SignedOut>
        <Link
          className="rounded-sm bg-white/30 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:scale-105 hover:bg-white/40"
          href={$path({
            route: "/auth/sign-up",
          })}
        >
          Sign Up
        </Link>
        <button
          className="rounded-sm bg-white/10 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:scale-105 hover:bg-white/20"
          onClick={() => {
            void push(
              $path({
                route: "/auth/sign-in",
                searchParams: { callbackUrl: window.location.href },
              })
            );
          }}
        >
          Login
        </button>
      </SignedOut>

      <SignedIn>
        <button
          className="rounded-sm bg-white/10 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:scale-105 hover:bg-white/20"
          onClick={() => void signOut()}
        >
          {"Sign out"}
        </button>
      </SignedIn>

      <div className="mr-8"></div>
    </>
  );
};

export default SignInButton;
