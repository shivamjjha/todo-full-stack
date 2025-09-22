import { relations } from "drizzle-orm"
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  slug: text().notNull().unique(), // public facing primary key (kinda)
  name: text(),
  username: text().notNull().unique(),
  email: text().unique(),
  password: text().notNull(),
})

export const todosTable = sqliteTable("todos_table", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int()
    .notNull()
    .references(() => usersTable.id),
  title: text().notNull(),
  description: text(),
  status: text().default("incomplete"), // incomplete, in-progress, complete
})

// user -> todos (1 to many)
export const usersRelation = relations(usersTable, ({ many }) => {
  return {
    todos: many(todosTable),
  }
})

export const todosRelation = relations(todosTable, ({ one }) => {
  return {
    owner: one(usersTable, {
      fields: [todosTable.userId],
      references: [usersTable.id],
    }),
  }
})
