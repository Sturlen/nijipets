import { type GetServerSideProps, type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import PetEditor from "~/c/PetEditor";
import { getServerAuthSession } from "~/server/auth";
import { type PetData } from "~/types";
import { api } from "~/utils/api";

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

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const utils = api.useContext();

  const pet = api.pets.create.useMutation({
    async onSettled() {
      await utils.pets.petbyOwnerId.invalidate();
    },
  });

  const save = (data: PetData) => {
    pet.mutate(data);
    void router.push("/pets");
  };

  return (
    <>
      <Head>
        <title>nijipets | Create a pet</title>
        <meta name="description" content="Create a unique pet!" />
      </Head>
      <main className="flex flex-grow flex-col bg-white p-4">
        <PetEditor onSave={save} />
      </main>
    </>
  );
};

export default Home;
