import { randomBytes } from "crypto"
import express from "express"
import jwt from "jsonwebtoken"
import { db } from "../../db/index.ts"
import { usersTable } from "../../db/schema.ts"
import z from "zod"
import { createInsertSchema } from "drizzle-zod"
import argon2 from "argon2"

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
      console.log("inserting user", rawData)

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

export { router as authRouter }
