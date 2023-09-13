import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { int, mysqlTable, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { z } from "zod";

// declaring enum in database
export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 24 }).primaryKey(), //cuid2
    username: varchar("username", { length: 256 }).unique().notNull(),
    password_hash: varchar("password_hash", { length: 256 }).notNull(),
    // created_at: timestamp("created_at").defaultNow().notNull(), // Invalid default value for 'created_at'
    coins: int("coins").default(0),
  },
  (users) => ({
    nameIndex: uniqueIndex("name_idx").on(users.username),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  pets: many(pets),
}));

export const UserIdSchema = z.string().cuid2("Invalid UserId").brand("UserId");
export type UserId = z.infer<typeof UserIdSchema>;

export const insertUserSchema = createInsertSchema(users, {
  id: UserIdSchema,
  username: z.string().nonempty(),
  password_hash: z.string().nonempty(),
});

export const selectUserSchema = createSelectSchema(users, {
  id: UserIdSchema,
});

export type SelectUser = z.infer<typeof selectUserSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;

export const pets = mysqlTable("pets", {
  id: varchar("id", { length: 24 }).primaryKey(), //cuid2
  name: varchar("name", { length: 256 }).notNull(),
  ownerId: varchar("owner_id", { length: 24 }).notNull(), // cuid2
  color: varchar("color", { length: 7 }).notNull(),
  glasses: int("glasses").notNull(),
});

export const petsRelations = relations(pets, ({ one }) => ({
  owner: one(users, {
    fields: [pets.ownerId],
    references: [users.id],
  }),
}));

export const PetIdSchema = z.string().cuid2("Invalid PetId").brand("PetId");
export type PetId = z.infer<typeof PetIdSchema>;

export const insertPetSchema = createInsertSchema(pets, {
  id: PetIdSchema,
  ownerId: UserIdSchema,
  color: z.string().startsWith("#").length(7), // TODO: make a RGB color type
  glasses: z.number().int().min(0),
});

export const PetApperanceSchema = insertPetSchema.pick({
  color: true,
  glasses: true,
});

export type PetApperance = z.infer<typeof PetApperanceSchema>;
