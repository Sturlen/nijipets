import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { $path } from "next-typesafe-url";
import Image from "next/image";
import { useRouter } from "next/router";
import Dragoon from "~/c/Dragoon";
import PetEditor from "~/c/PetEditor";
import { appRouter } from "~/server/api/root";
import { getServerAuthSession } from "~/server/auth";
import { PetIdSchema } from "~/types";

import { api, type RouterOutputs } from "~/utils/api";

type PetById = RouterOutputs["pets"]["findById"];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const petId_raw = ctx.params?.petId;

  if (typeof petId_raw !== "string") {
    throw new Error("bad request");
  }

  const petId = parseInt(petId_raw);

  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const pet = await appRouter.createCaller({ session }).pets.findById(petId);

  if (!pet) {
    throw new Error("Not Found");
  }

  if (pet.owner !== session.user.id) {
    throw new Error("Unauthorized");
  }

  session.user.email = null;
  session.user.image = null; // this should not be necessary

  return {
    props: { session, pet },
  };
};

type Props = {
  pet: PetById;
};

export default function Page({ pet: { id, apperance, ...rest } }: Props) {
  const utils = api.useContext();
  const router = useRouter();
  const petId = PetIdSchema.parse(id);
  const { mutate } = api.pets.upsert.useMutation({
    onMutate: ({ glasses, color }) => {
      utils.pets.findById.setData(petId, {
        id,
        apperance: { glasses, color },
        ...rest,
      });
    },
  }); // TODO: invalidate other queries and remove cache.
  return (
    <div className="flex flex-grow flex-col items-center bg-white p-4">
      <h1>The dressing room</h1>
      <div className="flex flex-col items-center">
        <PetEditor
          initalData={apperance}
          onSave={({ glasses, color }) => {
            mutate({ id: petId, glasses, color });
            void router.push(`/pets/${id}`);
          }}
        />
      </div>
    </div>
  );
}
