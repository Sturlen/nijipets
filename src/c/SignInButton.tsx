import { signIn, signOut, useSession } from "next-auth/react";

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
      {img_src && <img className="h-8 w-8 rounded-full" src={img_src} />}
      <button
        className="rounded-sm bg-white/10 px-10 py-3 text-4xl font-bold text-black no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </>
  );
};

export default SignInButton;
