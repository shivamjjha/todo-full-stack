import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { fileURLToPath } from "url"
import { authRouter } from "./routes/auth.ts"
import { todosRouter } from "./routes/todos.ts"
import { authMiddleware } from "./middlewares/auth.ts"
import path from "path"
const app = express()
const port = 5000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
console.log(path.join(__dirname, "ui"))
app.use(express.static(path.join(__dirname, "ui")))

app.use("/auth", authRouter)
app.use("/todos", authMiddleware, todosRouter)

app.use((err, req, res, next) => {
  // console.error("message", err.message, "stack", err.stack)
  res
    .status(500)
    .json({ stack: err.stack, message: err.message, ...(err ?? {}) })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
