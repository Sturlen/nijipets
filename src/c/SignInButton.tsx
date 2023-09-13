import { signOut, useSession } from "next-auth/react";
import { $path } from "next-typesafe-url";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const SignInButton: React.FC = () => {
  const { push } = useRouter();

  return (
    <>
      <SignedOut>
        <button
          className="rounded-sm bg-white/30 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:scale-105 hover:bg-white/40"
          onClick={() => {
            void push(
              $path({
                route: "/auth/sign-up",
                searchParams: { callbackUrl: window.location.href },
              })
            );
          }}
        >
          Sign Up
        </button>
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
        <UserButton />
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

const UserButton: React.FC = () => {
  const { data: userData } = api.pets.userHeader.useQuery();
  return (
    <>
      {userData && (
        <>
          <span className="text-4xl font-bold text-black">
            Welcome, {userData.username}! 🪙{userData.coins}
          </span>
        </>
      )}
    </>
  );
};

export default SignInButton;
