import mongoose from "mongoose"

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
})

// Compound index to ensure a user can only enroll once in a course
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })

const Enrollment = mongoose.model("Enrollment", enrollmentSchema)

export default Enrollment

