import mongoose from "mongoose"

const progressSchema = new mongoose.Schema({
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
  completedLessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  percentage: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
})

// Compound index to ensure a user has only one progress record per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true })

const Progress = mongoose.model("Progress", progressSchema)

export default Progress

