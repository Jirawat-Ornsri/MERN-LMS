import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." })
  }
}

export const optionalAuthenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (user) {
      req.user = user
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}

