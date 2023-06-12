import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const colorQuery = api.example.petbyOwnerId.useQuery("987337032265240629");
  const utils = api.useContext();

  const [color, setColor] = useState("#eeaaee");
  const pet = api.example.pet.useMutation({
    onMutate: async (value) => {},
  });

  return (
    <>
      <Head>
        <title>nijipets</title>
        <meta name="description" content="Less neo, more niji" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-grow flex-col bg-white p-4">
        <p>Play some games!</p>
        <p>{colorQuery.data?.color}</p>
        <section className="flex flex-col items-center">
          <div className="relative h-32 w-32">
            <img src="/dragoon_1_outline.png" className="absolute z-10" />
            <img src="/dragoon_1_color.png" className="absolute grayscale" />
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-70"
              style={{ color: color }}
            >
              <g>
                <title>Layer 1</title>
                <path
                  opacity="1"
                  strokeWidth="0"
                  stroke="#000"
                  fill="currentColor"
                  d="m68.91944,199.9147c0.94787,-20.61611 -0.47394,-18.48342 6.43601,-33.80096c5.6493,-9.80094 11.09953,-14.06634 10.90047,-14.21801c0.19906,0.15167 -12.36018,-2.9289 -12.55924,-3.08057c0.04976,0.03792 -19.34419,-3.66587 -29.46134,-12.93068c-10.11715,-9.26481 -8.58782,-7.02903 -14.5588,-21.65225c-1.04146,-56.26066 7.96328,-58.1564 25.73579,-77.35072c8.79271,-7.6936 27.53801,-16.0981 40.35915,-18.34147l19.50606,2.74858c-12.09495,18.45257 29.37347,32.7681 32.90419,9.34793c12.98564,5.76629 11.89826,9.64188 23.26022,19.37767c19.64336,12.36255 3.5391,35.60663 3.43957,35.5308c0.19906,0.15166 5.88626,1.81043 6.83413,8.20854c-0.47393,13.50711 -12.32227,26.54028 -12.52134,26.38862c0.19907,0.15166 -22.54975,15.31754 -22.74881,15.16587c0.19906,0.15167 17.7346,3.70617 17.7346,3.70617c0,0 20.37915,7.81991 20.37915,7.81991c0,0 12.32228,-9.00474 12.12321,-9.15641c0.19907,0.15167 14.41708,-16.90994 14.21801,-17.06161c0.90997,-2.69194 2.56874,-3.16587 6.39811,-2.8436c8.25593,4.891 6.3602,5.36493 10.42654,11.13744c2.56873,6.3128 2.33176,22.18958 2.1327,22.03791c0.19906,0.15167 -0.51184,11.52608 -0.7109,11.37441c-2.1706,11.52608 -5.88627,17.85781 -9.00474,20.85308c-3.11847,2.99527 -7.00948,4.81517 -9.95261,8.29384c-1.47157,1.73933 0.46489,9.31764 0.14077,24.28992c-0.32412,14.97229 1.83051,30.94044 -12.23788,31.92393c-14.06839,0.98349 -15.39062,-4.24992 -18.81776,-11.86442c-3.42714,-7.6145 -2.5611,-8.84232 -9.64629,-8.14149c-7.08519,0.70083 -7.2309,23.02904 -24.89974,23.91766c-17.66885,0.88862 -17.30361,-16.84895 -19.80553,-19.59302c-2.50193,-2.74407 -6.13406,-1.82643 -9.99424,-1.90699c-3.86018,-0.08056 -5.71859,20.44552 -23.52235,22.11821c-8.90188,0.83635 -12.07446,-10.44587 -12.70899,-18.60734c-0.63454,-8.16147 -1.1007,-10.59556 -1.2722,-14.1009c-0.1715,-3.50534 -9.45379,1.02606 -8.50592,-19.59005z"
                />
              </g>
            </svg>
          </div>
          <div className="flex flex-col">
            <label htmlFor="color">Color</label>
            <input
              name="color"
              type="color"
              value={color}
              onInput={(e) => setColor(e.currentTarget.value)}
            />
            <button
              className="rounded-md border border-black p-2 hover:bg-slate-100"
              onClick={() => {
                pet.mutate(color);
              }}
            >
              Save
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
