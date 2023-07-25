import Link from "next/link";
import { useRouter } from "next/router";
import { $path } from "next-typesafe-url";

const PETCREATOR_HREF = $path({ route: "/petcreator" });
const NIJIEXPRESS_HREF = $path({ route: "/nijiexpress" });
const PETS_HREF = $path({ route: "/pets" });

const Links: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex w-[350px] flex-col text-4xl font-bold">
      <nav className="m-10 flex flex-col items-center gap-10 text-center font-dragoon underline-offset-8">
        <Link href={PETCREATOR_HREF}>
          <span
            className={`font-medium ${
              router.pathname === PETCREATOR_HREF ? "underline" : ""
            }`}
          >
            Dragoon Creator 2022
          </span>
        </Link>
        <Link href={NIJIEXPRESS_HREF}>
          <span
            className={`font-medium ${
              router.pathname === NIJIEXPRESS_HREF ? "underline" : ""
            }`}
          >
            Nijisanji Express
          </span>
        </Link>
        <Link href={PETS_HREF}>
          <span
            className={`font-medium ${
              router.pathname === PETS_HREF ? "underline" : ""
            }`}
          >
            Pets
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Links;
