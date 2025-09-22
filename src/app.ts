import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { authRouter } from "./routes/auth.ts"
const app = express()
const port = 5000

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use(express.json())

app.use("/auth", authRouter)

app.use((err, req, res, next) => {
  // console.error("message", err.message, "stack", err.stack)
  res
    .status(500)
    .json({ stack: err.stack, message: err.message, ...(err ?? {}) })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
