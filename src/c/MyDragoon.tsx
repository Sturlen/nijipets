import { useSession } from "next-auth/react";
import Dragoon from "./Dragoon";
import { api } from "~/utils/api";

const MyDragoon: React.FC = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  const petQuery = api.example.petbyOwnerId.useQuery(userId || "", {
    enabled: !!sessionData,
  });

  return <>{petQuery.data && <Dragoon color={petQuery.data.color} />}</>;
};

export default MyDragoon;
