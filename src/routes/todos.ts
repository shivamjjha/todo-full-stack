import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import express from "express"
import jwt from "jsonwebtoken"
import { todosTable } from "../../db/schema.ts"
import z from "zod"
import { db } from "../../db/index.ts"
import { eq } from "drizzle-orm"
const router = express.Router()

const todosInsertSchema = createInsertSchema(todosTable)
const todosUpdateSchema = createUpdateSchema(todosTable)

router.post("/", async (req, res) => {
  // userId, title, description, status
  try {
    const { userId, title, description } = req.body
    const rawData = { userId, title, description }
    const validatedData = todosInsertSchema.safeParse(rawData)
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

router.put("/:id", async (req, res) => {
  const todoId = +req.params.id
  const { title, description, status } = req.body

  try {
    const rawData = { title, description, status }

    // TODO: check if modifying the same user as logged in

    const validatedData = todosUpdateSchema.safeParse(rawData)
    if (!validatedData.success) {
      throw {
        initialData: rawData,
        errors: z.treeifyError(validatedData.error).properties,
      }
    }

    const updated = await db
      .update(todosTable)
      .set(validatedData.data)
      .where(eq(todosTable.id, todoId))
      .returning({ id: todosTable.id })

    return res.status(200).json({ data: updated[0], ok: true })
  } catch (error) {
    return res.status(500).json({ ok: false, error })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const todoId = req.params.id
    if (!todoId) throw "No todo id provided"

    await db.delete(todosTable).where(eq(todosTable.id, +todoId))

    return res.status(200).json({ ok: true })
  } catch (error) {
    return res.status(500).json({ ok: false, error })
  }
})

router.get("/", async (req, res) => {
  try {
    // send all todos for a user
    const authorization = req.headers.authorization
    const token = authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    const userId = +(decoded as { id: number }).id
    if (!userId) {
      return res.status(400).json({ ok: false, error: "No user id provided" })
    }
    const todos = await db
      .select({
        id: todosTable.id,
        title: todosTable.title,
        description: todosTable.description,
        status: todosTable.status,
      })
      .from(todosTable)
      .where(eq(todosTable.userId, userId))

    return res.status(200).json(todos)
  } catch (e) {
    res.status(500).json({ ok: false, error: e })
  }
})

export { router as todosRouter }
