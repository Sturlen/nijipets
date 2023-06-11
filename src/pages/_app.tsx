import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Links from "~/c/Links";
import Link from "next/link";
import Image from "next/image";
import SignInButton from "~/c/SignInButton";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className="flex min-h-screen flex-col items-stretch justify-stretch bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="align-center flex items-center gap-1 bg-[#096fc3]">
          <Link href="/">
            <Image
              src="/logo.png"
              width={381}
              height={85}
              alt="Nijipets"
              priority
            />
          </Link>
          <h1 className="hidden">Nijipets</h1>
          <div className="mr-auto"></div>
          <SignInButton />
        </div>
        <div className="flex h-full flex-grow content-stretch justify-stretch bg-[#096fc3]">
          <Links />
          <Component {...pageProps} />
        </div>
      </main>
      <div></div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
