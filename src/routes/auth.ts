import express from "express"
const router = express.Router()

router.use("/", (_, res) => {
  res.status(200).json({ hello: "world" })
})

export { router as authRouter }
