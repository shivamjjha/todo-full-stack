import { randomBytes } from "crypto"
import express from "express"
import jwt from "jsonwebtoken"
import { db } from "../../db/index.ts"
import { usersTable } from "../../db/schema.ts"
import z from "zod"
import { createInsertSchema } from "drizzle-zod"
import argon2 from "argon2"
import { eq, or } from "drizzle-orm"

const router = express.Router()

const EXPIRES_HOUR = 1

router.post("/sign", (req, res) => {
  console.log("params", req.body, req.params)
  jwt.sign(
    req.body.data,
    process.env.JWT_SECRET!,
    {
      expiresIn: `${EXPIRES_HOUR}h`,
      algorithm: "HS512",
    },
    function (err, token) {
      if (err || !token) {
        throw err
      }
      res.status(200).send({
        token,
        // expires:
        //   Date.now() + EXPIRES_HOUR * 60 * 60 * 1000 /* - 0.5 * 60 * 1000 */,
      }) // expires in: (reduce 30s for safety)
    },
  )
})

router.post("/verify", (req, res) => {
  jwt.verify(req.body.data, process.env.JWT_SECRET!, function (err: unknown) {
    if (err) {
      res.status(401).json({ ok: false })
      return
    }

    res.status(200).json({ ok: true })
  })
})

const userSchema = createInsertSchema(usersTable)

router.post("/signup", (req, res) => {
  const rawData = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    name: req.body.name,
    slug: randomBytes(16).toString("hex"),
  }
  const validatedData = userSchema.safeParse(rawData)
  if (!validatedData.success) {
    const { slug, ...withoutSlug } = rawData
    throw {
      errors: z.treeifyError(validatedData.error).properties,
      initialData: withoutSlug,
    }
  }

  argon2
    .hash(validatedData.data.password)
    .then((hashedPassword) => {
      rawData.password = hashedPassword

      db.insert(usersTable)
        .values(rawData)
        .then(() => {
          res.status(200).json({ ok: true })
        })
        .catch((e) => {
          res.status(500).json({ ok: false, error: e })
        })
    })
    .catch((e) => {
      res.status(500).json({ ok: false, error: e })
      return
    })
})

router.post("/login", async (req, res) => {
  const userNameOrEmail = req.body.userNameOrEmail
  const passwordFromReq = req.body.password

  if (!(userNameOrEmail && passwordFromReq)) {
    return res.status(400).json({ ok: false, error: "Missing credentials" })
  }

  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        slug: usersTable.slug,
        username: usersTable.username,
        email: usersTable.email,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(
        or(
          eq(usersTable.username, userNameOrEmail),
          eq(usersTable.email, userNameOrEmail),
        ),
      )

    const user = users[0]
    if (!users.length || !user) {
      return res
        .status(401)
        .json({ ok: false, error: "Invalid username or password" })
    }

    const passwordHash = user.password
    const isVerified = await argon2.verify(passwordHash, passwordFromReq)

    if (!isVerified) {
      return res
        .status(401)
        .json({ ok: false, error: "Invalid username or password" })
    }

    if (isVerified) {
      const { password, ...userWithoutPassword } = user
      return res.status(200).json({ ok: true, userWithoutPassword })
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e })
  }
})

export { router as authRouter }
