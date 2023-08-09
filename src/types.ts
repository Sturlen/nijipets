import { z } from "zod";

export const PetApperanceSchema = z.object({
  color: z.string().startsWith("#").length(7), // TODO: make a RGB color type
  glasses: z.number().int().min(0),
});

export type PetApperance = z.infer<typeof PetApperanceSchema>;

export const PetIdSchema = z.number({ coerce: true }).int().min(0);

export const PetSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  owner: z.string().nonempty(),
  apperance: PetApperanceSchema,
});

export type Pet = z.infer<typeof PetSchema>;

export type PetItem = {
  name: string;
  src: string;
  // price: number
};

export const DefaultPetAppearance: Readonly<PetApperance> =
  PetApperanceSchema.parse({
    color: "#eeaaee",
    glasses: 0,
  });
