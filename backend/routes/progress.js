import express from "express"
import Progress from "../models/Progress.js"
import Course from "../models/Course.js"
import Enrollment from "../models/Enrollment.js"

const router = express.Router()

// Get all progress for the current user
router.get("/", async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
    res.json(progress)
  } catch (error) {
    console.error("Get progress error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get progress for a specific course
router.get("/course/:courseId", async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    })

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" })
    }

    res.json(progress)
  } catch (error) {
    console.error("Get course progress error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update progress for a lesson
router.post("/lesson/:courseId/:lessonId", async (req, res) => {
  try {
    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    })

    if (!enrollment) {
      return res.status(400).json({ message: "Not enrolled in this course" })
    }

    // Get course to calculate total lessons
    const course = await Course.findById(req.params.courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const totalLessons = course.lessons.length

    // Find or create progress record
    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    })

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        courseId: req.params.courseId,
        completedLessons: [],
        percentage: 0,
      })
    }

    // Add lesson to completed if not already there
    if (!progress.completedLessons.includes(req.params.lessonId)) {
      progress.completedLessons.push(req.params.lessonId)
    }

    // Calculate percentage
    progress.percentage = Math.round((progress.completedLessons.length / totalLessons) * 100)
    progress.lastUpdated = Date.now()

    await progress.save()

    // Update enrollment if course is completed
    if (progress.percentage === 100 && !enrollment.completed) {
      enrollment.completed = true
      enrollment.completedAt = Date.now()
      await enrollment.save()
    }

    res.json(progress)
  } catch (error) {
    console.error("Update lesson progress error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

