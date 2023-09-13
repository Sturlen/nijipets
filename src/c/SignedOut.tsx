import { useSession } from "next-auth/react";
import type { ReactElement } from "react";

type SignedOutProps = {
  children?: ReactElement[] | ReactElement;
};

const SignedOut: React.FC<SignedOutProps> = ({ children }) => {
  const { data: sessionData, status } = useSession();
  const is_signed_out = status == "unauthenticated";

  return <>{is_signed_out && children}</>;
};

export default SignedOut;
