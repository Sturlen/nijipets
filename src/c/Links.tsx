import Link from "next/link";
import { useRouter } from "next/router";

const Links: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex w-[350px] flex-col text-4xl font-bold">
      <nav className="m-10 flex flex-col items-center gap-10 text-center font-dragoon underline-offset-8">
        <Link href={"/petcreator"}>
          <span
            className={`font-medium ${
              router.pathname === "/petcreator" ? "underline" : ""
            }`}
          >
            Dragoon Creator 2022
          </span>
        </Link>
        <Link href={"/nijiexpress"}>
          <span
            className={`font-medium ${
              router.pathname === "/nijiexpress" ? "underline" : ""
            }`}
          >
            Nijisanji Express
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Links;
