import type { RequestHandler } from "express"
import jwt from "jsonwebtoken"

// ensure Bearer <token> is present in Authorization header and is valid
export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const headers = req.headers
    const authHeader = headers.authorization || headers.Authorization

    if (!(typeof authHeader === "string")) {
      return res.status(401).json({ ok: false, error: "Invalid Credentials" })
    }

    const token = authHeader?.split("Bearer ")[1]

    if (!token) {
      return res.status(401).json({ ok: false, error: "Invalid Credentials" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!)

    next()
  } catch (error) {
    return res.status(401).json({ ok: false, error: "Invalid Credentials" })
  }
}
