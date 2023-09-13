import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Dragoon from "~/c/Dragoon";
import { api } from "~/utils/api";

const CreatePet: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: pets } = api.pets.all.useQuery({});

  return (
    <>
      <Head>
        <title>Nijipets | Playground</title>
        <meta name="description" content="Play with other pets!" />
      </Head>
      <main className="w-full bg-white">
        <h1 className="bold text-center text-4xl font-bold text-black">
          The playground
        </h1>
        <div className="flex items-center justify-center">
          <ul className="ml-4 mr-4 flex flex-row flex-wrap gap-2">
            {pets && status !== "loading"
              ? pets.map(
                  // TODO: this should be it's own list component.
                  ({
                    id,
                    apperance,
                    owner: { id: ownerId, username },
                    name,
                  }) => (
                    <li key={id} className="p-1">
                      <Link href={`/pets/${id}`}>
                        <div className="rounded-md p-4 hover:bg-slate-500/10">
                          <Dragoon data={apperance} />
                        </div>
                      </Link>
                      <p>{name}</p>
                      <p>
                        {session?.user.id == ownerId
                          ? "Your pet"
                          : `Owner: ${username}`}
                      </p>
                    </li>
                  )
                )
              : loading_skeletons}
          </ul>
        </div>
      </main>
    </>
  );
};

// TODO: standardise for all pet lists
// TODO: standardise pet image sizes
const loading_skeletons = Array(16)
  .fill(undefined)
  .map((_, i) => (
    <li className="m-1 block" key={i}>
      <div className="block h-[128px] w-[128px] rounded-md bg-slate-400"></div>
      <p className=" mt-1  block w-[128px] rounded-md bg-slate-400 text-transparent">
        🗿
      </p>
    </li>
  ));

export default CreatePet;
