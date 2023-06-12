import { useSession } from "next-auth/react";
import { ReactElement } from "react";

type SignedInProps = {
  children?: ReactElement[] | ReactElement;
};

const SignedIn: React.FC<SignedInProps> = ({ children }) => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  return <>{sessionData ? children : null}</>;
};

export default SignedIn;
