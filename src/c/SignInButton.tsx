import { signIn, signOut, useSession } from "next-auth/react";
import { $path } from "next-typesafe-url";
import Link from "next/link";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";

const SignInButton: React.FC = () => {
  const { data: sessionData } = useSession();

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
          className="rounded-sm bg-white/10 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:scale-105 hover:bg-white/20"
          href={$path({
            route: "/auth/sign-up",
          })}
        >
          Sign Up
        </Link>
        <button
          className="rounded-sm bg-white/10 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:scale-105 hover:bg-white/20"
          onClick={() => void signIn()}
        >
          {"Sign in"}
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
