import { signIn, signOut, useSession } from "next-auth/react";
import { $path } from "next-typesafe-url";
import Link from "next/link";
import SignedIn from "./SignedIn";

const SignInButton: React.FC = () => {
  const { data: sessionData } = useSession();

  const img_src = sessionData?.user.image || undefined;

  return (
    <>
      {sessionData && (
        <>
          <p className="text-4xl font-bold text-black">
            Welcome, {sessionData.user.name || undefined}!
          </p>
        </>
      )}
      {img_src && <img className="h-8 w-8 rounded-full" src={img_src} alt="" />}

      <Link
        className="rounded-sm bg-white/10 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:bg-white/20"
        href={$path({
          route: "/auth/sign-up",
          searchParams: { callbackUrl: "/pets" },
        })}
      >
        Sign Up
      </Link>

      <button
        className="rounded-sm bg-white/10 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:bg-white/20"
        onClick={() => void signIn()}
      >
        {"Sign in"}
      </button>

      <SignedIn>
        <button
          className="rounded-sm bg-white/10 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:bg-white/20"
          onClick={() => void signOut()}
        >
          {"Sign out"}
        </button>
      </SignedIn>
    </>
  );
};

export default SignInButton;
