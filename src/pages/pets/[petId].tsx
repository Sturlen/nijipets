import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Dragoon from "~/c/Dragoon";

import { api } from "~/utils/api";

export default function Page({}) {
  const { data: session, status } = useSession();
  const {
    query: { petId },
    isReady,
  } = useRouter();

  const queryId = typeof petId === "string" ? parseInt(petId) : 0;

  const { data, isLoading, isError, error } = api.pets.findById.useQuery(
    queryId,
    {
      enabled: isReady,
      staleTime: 1000,
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  const formErrors = error?.data?.zodError?.formErrors;

  const ready = !!data && status !== "loading";

  const is_yours = ready && session?.user.id === data.owner;

  return (
    <div className="flex flex-grow flex-col items-center bg-white p-4">
      {isLoading && <p>Looking...</p>}
      {ready && (
        <div className="flex flex-col items-center">
          <p className="text-2xl italic"> {`#${data.id.padStart(3, "0")}`}</p>
          <Dragoon data={data.apperance} />
          {is_yours && <p>There may be many like it, but this one is yours!</p>}
          {is_yours && (
            <Link
              href={`/dressup/${data.id}`}
              className="rounded-md border border-black p-4 font-bold hover:bg-slate-100"
            >
              Modify appearance
            </Link>
          )}
        </div>
      )}
      {isError && error.shape?.data.code === "NOT_FOUND" && (
        <div className="flex flex-col items-center">
          <Image
            src="/despair.png"
            className=""
            alt=""
            width="68"
            height="64"
          />
          <p>404 Goon Not Found</p>
        </div>
      )}
      {isError && error.shape?.data.code !== "NOT_FOUND" && (
        <div className="flex flex-col items-center">
          <Image
            src="/despair.png"
            className=""
            alt=""
            width="68"
            height="64"
          />
          <p>{error.data?.code}</p>
          {formErrors && (
            <pre>Error: {JSON.stringify(formErrors, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
