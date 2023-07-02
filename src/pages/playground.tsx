import { type NextPage } from "next";
import Head from "next/head";
import Dragoon from "~/c/Dragoon";
import { api } from "~/utils/api";

const CreatePet: NextPage = () => {
  const { data: pets } = api.pets.all.useQuery({});

  return (
    <>
      <Head>
        <title>Nijipets | Playground</title>
        <meta name="description" content="Play with other pets!" />
      </Head>
      <main className="w-full bg-white">
        <div className="flex items-center justify-center">
          {pets && (
            <ul className="flex flex-row items-center justify-center">
              {pets.map((pet, i) => (
                <li key={i}>
                  <Dragoon data={pet} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
};

export default CreatePet;
