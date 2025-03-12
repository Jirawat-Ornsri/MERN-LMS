import express from "express"
import Course from "../models/Course.js"
import { optionalAuthenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Get all courses with optional filtering
router.get("/", optionalAuthenticateToken, async (req, res) => {
  try {
    const { category, limit } = req.query

    const query = {}
    if (category) {
      query.category = category
    }

    let coursesQuery = Course.find(query)

    if (limit) {
      coursesQuery = coursesQuery.limit(Number.parseInt(limit))
    }

    const courses = await coursesQuery.sort({ createdAt: -1 })

    res.json(courses)
  } catch (error) {
    console.error("Get courses error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a specific course by ID
router.get("/:id", optionalAuthenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json(course)
  } catch (error) {
    console.error("Get course error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

