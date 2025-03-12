import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      interests: req.user.interests,
      avatar: req.user.avatar,
    }

    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body

    const user = await User.findById(req.user._id)

    if (name) user.name = name

    await user.save()

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      interests: user.interests,
      avatar: user.avatar,
    }

    res.json(userResponse)
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user password
router.put("/password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." })
    }

    // Update password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()

    res.json({ message: "Password updated successfully." })
  } catch (error) {
    console.error("Update password error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user interests
router.put("/interests", authenticateToken, async (req, res) => {
  try {
    const { interests } = req.body

    const user = await User.findById(req.user._id)
    user.interests = interests

    await user.save()

    res.json({ interests: user.interests })
  } catch (error) {
    console.error("Update interests error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

