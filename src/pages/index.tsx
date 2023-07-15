import { type NextPage } from "next";
import Head from "next/head";
import PetEditor from "~/c/PetEditor";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>nijipets</title>
        <meta name="description" content="Less neo, more niji" />
      </Head>
      <main className="flex flex-grow flex-col items-center bg-white p-4">
        <h2 className="text-xl">Work In Progress</h2>
        <p>
          {
            "Only real function is creating a pet, which can be done with clicking on PETS on the left. You have to be logged in to do this, make up whatever username/password you like"
          }
        </p>
        <div className="mt-4 rounded-md border p-8">
          <PetEditor />
        </div>
      </main>
    </>
  );
};

export default Home;
