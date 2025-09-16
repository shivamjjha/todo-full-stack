import express from "express"
import { authRouter } from "./routes/auth.ts"
const app = express()
const port = 5000

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/auth", authRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
