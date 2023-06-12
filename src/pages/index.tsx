import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Dragoon from "~/c/Dragoon";
import SignedIn from "~/c/SignedIn";
import SignedOut from "~/c/SignedOut";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const colorQuery = api.example.petbyOwnerId.useQuery("987337032265240629");
  const utils = api.useContext();

  const [color, setColor] = useState("#eeaaee");
  const pet = api.example.pet.useMutation({
    onMutate: async (value) => {
      await utils.example.petbyOwnerId.cancel();
      // @ts-expect-error
      utils.example.petbyOwnerId.setData(undefined, {
        color: value,
      });
    },
    onSettled() {
      utils.example.petbyOwnerId.invalidate();
    },
  });

  return (
    <>
      <Head>
        <title>nijipets</title>
        <meta name="description" content="Less neo, more niji" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-grow flex-col bg-white p-4">
        <section className="flex flex-col items-center">
          <h2>Pet Editor</h2>
          <Dragoon color={color} />

          <div className="flex flex-col">
            <label htmlFor="color">Color</label>
            <input
              name="color"
              type="color"
              value={color}
              onInput={(e) => setColor(e.currentTarget.value)}
            />
            <SignedIn>
              <button
                className="rounded-md border border-black p-2 hover:bg-slate-100"
                onClick={() => {
                  pet.mutate(color);
                }}
              >
                Save
              </button>
            </SignedIn>
            <SignedOut>
              <p>You need to be logged in to save changes to your pet.</p>
            </SignedOut>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
