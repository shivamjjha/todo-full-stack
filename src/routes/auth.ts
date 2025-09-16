import express from "express"
import jwt from "jsonwebtoken"

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

// router.post("/verify")

export { router as authRouter }
