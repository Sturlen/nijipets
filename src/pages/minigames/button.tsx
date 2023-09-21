import { $path } from "next-typesafe-url";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

export default function Page() {
  const [submitting, setSubmitting] = useState(false);
  const utils = api.useContext();
  const { push } = useRouter();
  const { mutateAsync } = api.pets.minigameComplete.useMutation();

  const submit = async () => {
    await mutateAsync();
    await utils.pets.userHeader.refetch();
    setSubmitting(false);
    await push($path({ route: "/minigames" }));
  };

  const onClick = () => {
    if (!submitting) {
      setSubmitting(true);
      void submit();
    }
  };

  return (
    <div className="flex flex-grow flex-col items-center bg-white p-4">
      <h1 className="bold text-center text-4xl font-bold text-black">
        The Button
      </h1>
      <p className="font-serif">Dare you press the forbidden button?</p>
      <div className="p-4" />
      {!submitting && (
        <div className="flex flex-col items-center">
          <button
            onClick={onClick}
            className="active:border-b-1 rounded-md border bg-red-600 p-8 font-mono text-3xl text-white shadow-md hover:bg-red-400 active:translate-y-1 active:shadow-sm"
          >
            Press Me
          </button>
        </div>
      )}
      {submitting && (
        <div>
          <p>Submitting Score...</p>
        </div>
      )}
    </div>
  );
}
