import mongoose from "mongoose";

// สร้าง Schema สำหรับ Videos
const videoSchema = new mongoose.Schema({
  video_id: Number,
  title: String,
  url: String,
});

// สร้าง Schema สำหรับ Questions ใน Quiz
const questionSchema = new mongoose.Schema({
  question_id: Number,
  question: String,
  options: [String], // ตัวเลือกของคำถาม
  answer: String, // คำตอบที่ถูกต้อง
});

// สร้าง Schema สำหรับ Quiz
const quizSchema = new mongoose.Schema({
  quiz_id: Number,
  title: String,
  questions: [questionSchema], // เชื่อมกับคำถาม
});

// สร้าง Schema สำหรับ Lessons
const lessonSchema = new mongoose.Schema({
  lesson_id: Number,
  title: String,
  description: String,
  videos: [videoSchema],
  quiz: quizSchema,
});

// Updated course schema
const courseSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [String], // Array of categories (e.g., ["Programming", "Web Development"])
      required: true,
    },
    image: {
      type: String,
      default: "", // Default is an empty string if no image is provided
    },
    instructor: {
      type: String,
      required: true,
    },
    lessons: [lessonSchema], // เพิ่ม lessons ลงในคอร์ส
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
