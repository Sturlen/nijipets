import Image from "next/image";
import { useRouter } from "next/router";
import Dragoon from "~/c/Dragoon";

import { api } from "~/utils/api";

export default function Page({}) {
  const {
    query: { petId },
    isReady,
  } = useRouter();

  const queryId = typeof petId === "string" ? parseInt(petId) : 0;

  const { data, isLoading, isError, error } = api.pets.findById.useQuery(
    queryId,
    {
      enabled: isReady,
      staleTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
      refetchInterval: Infinity,
    }
  );

  const formErrors = error?.data?.zodError?.formErrors;

  return (
    <div className="flex flex-grow flex-col items-center bg-white p-4">
      {isLoading && <p>Looking...</p>}
      {data && <Dragoon data={data} />}
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
