export type PetApperance = {
  color: string;
  glasses: number;
};

export type PetItem = {
  name: string;
  src: string;
  // price: number
};

export const DefaultPet: Readonly<PetApperance> = {
  color: "#eeaaee",
  glasses: 0,
};
