import { type NextPage } from "next";
import Head from "next/head";
import { getServerAuthSession } from "../server/auth";
import { type GetServerSideProps } from "next";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Dragoon from "~/c/Dragoon";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
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
const PetsPage: NextPage = () => {
  const { data: session } = useSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: pets, isInitialLoading } = api.pets.listByOwner.useQuery({
    ownerUserId: session?.user.id,
  });
  return (
    <>
      <Head>
        <title>Nijipets | Your pets</title>
        <meta name="description" content="View your pets" />
      </Head>
      <main className="flex w-full flex-grow bg-white">
        <div className="h-full w-full">
          {isInitialLoading && <p>:DragoonPause:</p>}
          {pets && (
            <ul className="flex flex-row">
              {pets.map((petData, i) => (
                <Dragoon data={petData} key={i} />
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
};

export default PetsPage;
