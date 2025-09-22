import { createInsertSchema } from "drizzle-zod"
import express from "express"
import { todosTable } from "../../db/schema.ts"
import z from "zod"
import { db } from "../../db/index.ts"
const router = express.Router()

const todosSchema = createInsertSchema(todosTable)

router.post("/", async (req, res) => {
  // userId, title, description, status
  try {
    const { userId, title, description } = req.body
    const rawData = { userId, title, description }
    const validatedData = todosSchema.safeParse(rawData)
    if (!validatedData.success) {
      throw {
        initialData: rawData,
        errors: z.treeifyError(validatedData.error).properties,
      }
    }

    const todoItems = await db
      .insert(todosTable)
      .values(validatedData.data)
      .returning({ id: todosTable.id })

    const itemAdded = todoItems[0]
    return res.json({ data: itemAdded, ok: true }).status(200)
  } catch (error) {
    return res.status(500).json({ ok: false, error })
  }
})

export { router as todosRouter }
