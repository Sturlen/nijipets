import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-grow flex-col items-center bg-white p-4">
      <h1 className="bold text-center text-4xl font-bold text-black">
        Minigames
      </h1>
      <p className="font-serif">Play games with your pets and earn rewards!</p>
      <div className="p-4" />
      <div className="flex flex-col items-center">
        <ul>
          <li className="border bg-white shadow-sm">
            <Link href={"/minigames/button"}>
              <Image
                src={"/logo.png"}
                width={400}
                height={300}
                alt="minigame image"
                className="select-none"
              />
              <h3 className="p-2 font-dragoon">Press the Button</h3>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
