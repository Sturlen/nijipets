import { signOut, useSession } from "next-auth/react";
import { $path } from "next-typesafe-url";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useEffect, useRef, useState, useTransition } from "react";

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
  const initial = useRef(true);
  const [animating, setAnimating] = useState(false);
  const coins = userData?.coins ?? undefined;

  // ANIMATION TEST. Play an effect when you get coins. should be an easier way of doing this.
  useEffect(() => {
    if (coins == undefined) {
      return;
    }
    if (initial.current) {
      initial.current = false;
      return;
    }
    console.log("COINS");
    setAnimating(true);
    const t = setTimeout(() => {
      setAnimating(false);
      console.log("COINS STOP");
    }, 700);
    return () => clearTimeout(t);
  }, [coins]);
  return (
    <>
      {userData && (
        <>
          <span className="text-4xl font-bold text-black">
            Welcome, {userData.username}!
            <span
              className={
                animating
                  ? "text-white transition-all"
                  : "text-black transition-all"
              }
            >
              {" "}
              🪙{userData.coins}
            </span>
          </span>
        </>
      )}
    </>
  );
};

export default SignInButton;
