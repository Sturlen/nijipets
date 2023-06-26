import { useSession } from "next-auth/react";
import type { ReactElement } from "react";

type SignedOutProps = {
  children?: ReactElement[] | ReactElement;
};

const SignedOut: React.FC<SignedOutProps> = ({ children }) => {
  const { data: sessionData } = useSession();

  return <>{sessionData ? null : children}</>;
};

export default SignedOut;
