import express from "express"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/sign", (req, res) => {
  console.log("params", req.body, req.params)
  jwt.sign(
    req.body.data,
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
      algorithm: "HS512",
    },
    function (err, token) {
      if (err) {
        throw err
      }
      res.status(200).send(token)
    },
  )
})

export { router as authRouter }
