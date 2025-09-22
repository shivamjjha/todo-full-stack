import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  slug: text().notNull().unique(), // public facing primary key (kinda)
  name: text().notNull(),
  username: text().notNull().unique(),
  email: text().unique(),
  password: text().notNull(),
})
