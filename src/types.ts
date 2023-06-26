export type PetData = {
  colorHex: string;
  glassesId: number;
};

export type PetItem = {
  //   name: string;
  src: string;
  // price: number
};

export const DefaultPet: Readonly<PetData> = {
  colorHex: "#eeaaee",
  glassesId: 0,
};
