import { useSession } from "next-auth/react";
import type { ReactElement } from "react";

type childrenFunc = (userId: string) => ReactElement[] | ReactElement;

type SignedInProps = {
  children: childrenFunc | ReactElement[] | ReactElement;
};

const SignedIn: React.FC<SignedInProps> = ({ children }) => {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

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

  return <>{render()}</>;
};

export default SignedIn;
