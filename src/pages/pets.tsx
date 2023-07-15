import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { getServerAuthSession } from "../server/auth";
import { type GetServerSideProps } from "next";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Dragoon from "~/c/Dragoon";
import Link from "next/link";
import { petbyOwnerId } from "~/server/db";
import { PetData } from "~/types";

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

  const initialData = await petbyOwnerId(session.user.id);

  const initialDataUpdatedAt = Date.now();

  console.log("pets1", initialData);

  return {
    props: { session, initialData, initialDataUpdatedAt },
  };
};

type PetsPagePrips = {
  initialData: PetData[];
  initialDataUpdatedAt: number;
};

/** View all your pets */
export default function Page({
  initialData,
  initialDataUpdatedAt,
}: PetsPagePrips) {
  const { data: session } = useSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: pets, isInitialLoading } = api.pets.listByOwner.useQuery(
    {
      ownerUserId: session.user.id,
    },
    {
      initialData: initialData,
      initialDataUpdatedAt,
    }
  );
  return (
    <>
      <Head>
        <title>Nijipets | Your pets</title>
        <meta name="description" content="View your pets" />
      </Head>
      <main className="flex flex-grow flex-col items-center bg-white p-4">
        <p className="mb-1">This is where you keep your goons</p>
        {isInitialLoading && <p>:DragoonPause:</p>}
        {pets && pets.length && (
          <ul className="ml-4 mr-4 flex flex-row flex-wrap">
            {pets.map((petData, i) => (
              <Dragoon data={petData} key={i} />
            ))}
          </ul>
        )}
        {pets && !pets.length && (
          <div>
            <p>
              You pet collection is looking mighty empty, maybe time to adopt
              some?
            </p>
          </div>
        )}
        <Link
          href={"/createagoon"}
          className="box-border rounded-md border border-black p-2 hover:bg-slate-100"
        >
          Adopt a new pet
        </Link>
      </main>
    </>
  );
}
