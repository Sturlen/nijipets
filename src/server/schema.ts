import {
  int,
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
    username: varchar("username", { length: 256 }).notNull(),
    password_hash: varchar("password_hash", { length: 256 }).notNull(),
  },
  (users) => ({
    nameIndex: uniqueIndex("name_idx").on(users.username),
  })
);

export const pets = mysqlTable("pets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  owner: varchar("owner", { length: 256 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  glasses: int("glasses").notNull(),
});
