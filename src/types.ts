import { z } from "zod";
/** @deprecated */
export const PetApperanceSchema = z.object({
  color: z.string().startsWith("#").length(7), // TODO: make a RGB color type
  glasses: z.number().int().min(0),
});
/** @deprecated */
export type PetApperance = z.infer<typeof PetApperanceSchema>;

/** @deprecated */
export const PetIdSchema = z.number({ coerce: true }).int().min(0).brand("pet");

/** @deprecated */
export const PetSchema = z.object({
  id: PetIdSchema,
  name: z.string().nonempty(),
  ownerId: z.string(),
  apperance: PetApperanceSchema,
});

/** @deprecated */
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
