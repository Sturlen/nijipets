import {
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// declaring enum in database
export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
  },
  (users) => ({
    nameIndex: uniqueIndex("name_idx").on(users.name),
  })
);

export const pets = mysqlTable("pets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
});
