import {
  int,
  mysqlTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { DefaultPet } from "~/types";

// declaring enum in database
export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    discord_id: varchar("discord_id", { length: 256 }),
  },
  (users) => ({
    nameIndex: uniqueIndex("name_idx").on(users.name),
  })
);

export const pets = mysqlTable("pets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  owner: varchar("owner", { length: 256 }),
  color: varchar("color", { length: 7 }).default(DefaultPet.color),
  glasses: int("glasses").default(DefaultPet.glasses),
});
