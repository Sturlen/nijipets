//items for dressing up your dragoon

import type { PetItem } from "./types";

export const empty_dragoon_glasses: Readonly<PetItem> = {
  name: "None",
  src: "",
};

export const dragoon_glasses: ReadonlyArray<Readonly<PetItem>> = [
  empty_dragoon_glasses,
  {
    name: "Supreme Shades",
    src: "/dragoon_1_glasses_0.png",
  },
  {
    name: "Bookworm's Delight",
    src: "/dragoon_1_glasses_1.png",
  },
  {
    name: "Now I'm Angy",
    src: "/dragoon_1_glasses_2.png",
  },
  {
    name: "Mad Hatter",
    src: "/dragoon_1_hat_0.png",
  },
  {
    name: "Sprout",
    src: "/dragoon_1_hat_1.png",
  },
  {
    name: "Comfy Sweater",
    src: "/dragoon_1_sweater.png",
  },
];
