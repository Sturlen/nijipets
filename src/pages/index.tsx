import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import Dragoon from "~/c/Dragoon";
import PetEditor from "~/c/PetEditor";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const userId = "swag";
  const { data: SessionData, status } = useSession();

  const petQuery = api.pets.petbyOwnerId.useQuery(SessionData?.user.id || "", {
    enabled: !!SessionData?.user,
  }); // need to work on loading existing data first
  const utils = api.useContext();

  const pet_data = petQuery.data;

  const pet = api.pets.pet.useMutation({
    onMutate: async (value) => {
      // await utils.pets.petbyOwnerId.cancel();

      // utils.pets.petbyOwnerId.setData(userId, value);

      return { value };
    },
    async onSettled(data, error, ctx) {
      await utils.pets.petbyOwnerId.invalidate();
    },
  });

  return (
    <>
      <Head>
        <title>nijipets</title>
        <meta name="description" content="Less neo, more niji" />
      </Head>
      <main className="flex flex-grow flex-col bg-white p-4">
        {SessionData && <PetEditor initalData={pet_data} onSave={pet.mutate} />}
        {status === "unauthenticated" && (
          <section>
            <p>
              You must be logged in to create a pet. You can try out the editor
              if ya like:
            </p>
            <PetEditor />
          </section>
        )}
        {status === "loading" && <p>:DragoonPause:</p>}
      </main>
    </>
  );
};

export default Home;
