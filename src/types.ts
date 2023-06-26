export type PetData = {
  color: string;
  glasses: number;
};

export type PetItem = {
  name: string;
  src: string;
  // price: number
};

export const DefaultPet: Readonly<PetData> = {
  color: "#eeaaee",
  glasses: 0,
};
