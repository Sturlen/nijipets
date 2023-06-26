import { useSession } from "next-auth/react";
import Dragoon from "./Dragoon";
import { api } from "~/utils/api";
import { PetData } from "~/types";

const MyDragoon: React.FC = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  const petQuery = api.example.petbyOwnerId.useQuery(userId || "", {
    enabled: !!sessionData,
  });

  const color = petQuery.data?.color;

  const data: PetData = { colorHex: color || "#ff00ff", glassesId: 1 };

  return <>{petQuery.data && <Dragoon data={data} />}</>;
};

export default MyDragoon;
