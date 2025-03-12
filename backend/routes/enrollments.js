import express from "express"
import Enrollment from "../models/Enrollment.js"
import Course from "../models/Course.js"
import Progress from "../models/Progress.js"

const router = express.Router()

// Get all enrollments for the current user
router.get("/", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id }).populate("courseId").sort({ enrolledAt: -1 })

    // Extract just the course data
    const courses = enrollments.map((enrollment) => enrollment.courseId)

    res.json(courses)
  } catch (error) {
    console.error("Get enrollments error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Check if user is enrolled in a specific course
router.get("/check/:courseId", async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    })

    res.json({ isEnrolled: !!enrollment })
  } catch (error) {
    console.error("Check enrollment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Enroll in a course
router.post("/", async (req, res) => {
  try {
    const { courseId } = req.body

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId,
    })

    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" })
    }

    // Create enrollment
    const enrollment = new Enrollment({
      userId: req.user._id,
      courseId,
    })

    await enrollment.save()

    // Increment enrollment count
    course.enrollmentCount += 1
    await course.save()

    // Create initial progress record
    const progress = new Progress({
      userId: req.user._id,
      courseId,
      completedLessons: [],
      percentage: 0,
    })

    await progress.save()

    res.status(201).json(enrollment)
  } catch (error) {
    console.error("Enroll error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router

