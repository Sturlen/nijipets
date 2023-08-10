import Head from "next/head";
import { getServerAuthSession } from "~/server/auth";
import { type GetServerSideProps } from "next";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Dragoon from "~/c/Dragoon";
import Link from "next/link";
import { $path } from "next-typesafe-url";

const CREATEAGOON_HREF = $path({ route: "/createagoon" });

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  session.user.email = null;
  session.user.image = null; // this should not be necessary

  return {
    props: { session },
  };
};

/** View all your pets */
export default function Page() {
  const { data: session } = useSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data, isLoading, isError } = api.pets.listByOwner.useQuery({
    ownerUserId: session.user.id,
  });

  const pets = data?.pets;

  return (
    <>
      <Head>
        <title>Nijipets | Your pets</title>
        <meta name="description" content="View your pets" />
      </Head>
      <main className="flex flex-grow flex-col items-center bg-white p-4">
        <p className="mb-1">This is where you keep your goons</p>
        {isLoading && <p>Gathering your goons...</p>}
        {pets && pets.length > 0 && (
          <ul className="ml-4 mr-4 flex flex-row flex-wrap">
            {pets.map((petData, i) => (
              <Dragoon data={petData} key={i} />
            ))}
          </ul>
        )}
        {pets && pets.length === 0 && (
          <div>
            <p>
              You pet collection is looking mighty empty, maybe time to adopt
              some?
            </p>
          </div>
        )}
        {isError && <p>Could not retrive your goons. Try again later.</p>}
        <Link
          href={CREATEAGOON_HREF}
          className="m-4 box-border rounded-md border border-black p-2 hover:bg-slate-100"
        >
          Adopt a new pet
        </Link>
      </main>
    </>
  );
}
