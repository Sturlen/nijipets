import { useSession } from "next-auth/react";
import type { ReactElement } from "react";

type childrenFunc = (userId: string) => ReactElement[] | ReactElement;

type SignedInProps = {
  children: childrenFunc | ReactElement[] | ReactElement;
};

const SignedIn: React.FC<SignedInProps> = ({ children }) => {
  const { data: sessionData, status } = useSession();
  const userId = sessionData?.user.id;
  const is_signed_in = status == "authenticated";

  function render() {
    if (!userId) {
      return null;
    }

    if (typeof children === "function") {
      return children(userId);
    } else {
      return children;
    }
  }

  return <>{is_signed_in && render()}</>;
};

export default SignedIn;
