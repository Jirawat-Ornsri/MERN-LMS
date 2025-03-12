import mongoose from "mongoose"

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
})

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["เริ่มต้น", "ปานกลาง", "สูง"],
    default: "เริ่มต้น",
  },
  duration: {
    type: Number,
    default: 0,
  },
  lessons: [lessonSchema],
  enrollmentCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Course = mongoose.model("Course", courseSchema)

export default Course

