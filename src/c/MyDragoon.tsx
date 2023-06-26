import { useSession } from "next-auth/react";
import Dragoon from "./Dragoon";
import { api } from "~/utils/api";

const MyDragoon: React.FC = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  const petQuery = api.pets.petbyOwnerId.useQuery(userId || "", {
    enabled: !!sessionData,
  });

  const data = petQuery.data;

  return <>{data && <Dragoon data={data} />}</>;
};

export default MyDragoon;
