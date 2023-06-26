//items for dressing up your dragoon

import { PetItem } from "./types";

export const empty_dragoon_glasses: Readonly<PetItem> = {
  src: "",
};

export const dragoon_glasses: ReadonlyArray<Readonly<PetItem>> = [
  empty_dragoon_glasses,
  {
    src: "/dragoon_1_glasses_0.png",
  },
  {
    src: "/dragoon_1_glasses_1.png",
  },
  {
    src: "/dragoon_1_glasses_2.png",
  },
];
