import { type NextPage } from "next";
import Head from "next/head";

const CreatePet: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nijipets | Pet Creator</title>
        <meta name="description" content="Create your own Dragoon pet!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-grow">
        <iframe className="flex-grow" src="https://dragoon.selen2022.com" />
      </main>
    </>
  );
};

export default CreatePet;
