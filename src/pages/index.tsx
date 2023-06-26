import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Dragoon from "~/c/Dragoon";
import SignedIn from "~/c/SignedIn";
import SignedOut from "~/c/SignedOut";
import { dragoon_glasses } from "~/items";
import { DefaultPet, PetData } from "~/types";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const userId = "swag";
  // const petQuery = api.example.petbyOwnerId.useQuery(userId, {
  //   placeholderData: DefaultPet,
  // }); // need to work on loading existing data first
  const utils = api.useContext();

  const [color, setColor] = useState("#eeaaee");
  const [glasses_id, setGlassesId] = useState<number>(0);

  const pet = api.example.pet.useMutation({
    onMutate: async (value) => {
      console.log("mutate da state");
      await utils.example.petbyOwnerId.cancel();

      utils.example.petbyOwnerId.setData(userId, value);

      return { value };
    },
    async onSettled(data, error, ctx) {
      await utils.example.petbyOwnerId.invalidate();
    },
  });
  const data: PetData = {
    color: color,
    glasses: glasses_id,
  };

  return (
    <>
      <Head>
        <title>nijipets</title>
        <meta name="description" content="Less neo, more niji" />
      </Head>
      <main className="flex flex-grow flex-col bg-white p-4">
        <section className="flex flex-col items-center">
          <h2>Pet Editor</h2>
          <Dragoon data={data} />

          <div className="flex flex-col">
            <label htmlFor="color">Color</label>
            <input
              name="color"
              type="color"
              value={color}
              onInput={(e) => setColor(e.currentTarget.value)}
            />
            <select
              name="glasses"
              id="glasses"
              value={data.glasses}
              onInput={(e) => setGlassesId(parseInt(e.currentTarget.value))}
            >
              {dragoon_glasses.map((item, i) => {
                return (
                  <option key={i} value={i.toString()}>
                    {item.src}
                  </option>
                );
              })}
            </select>
            <SignedIn>
              <button
                className="rounded-md border border-black p-2 hover:bg-slate-100"
                onClick={() => {
                  pet.mutate({ color: data.color, glasses: glasses_id });
                }}
                disabled={pet.isLoading}
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
