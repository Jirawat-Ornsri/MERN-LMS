import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    interests: { type: Array },
    completedVideos: [
      {
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        video_id: { type: String }
      }
    ],
    completedQuizzes: [
      {
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        quiz_id: { type: String },
        correctAnswers: { type: Number }, // จำนวนคำตอบที่ถูกต้อง
        totalQuestions: { type: Number }, // จำนวนคำถามทั้งหมด
        score: { type: Number }, // คะแนนที่ได้
        answers: [{ type: String }], // คำตอบที่เลือกโดยผู้ใช้
      }
    ],
    continueWatching: [
      {
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        video_id: { type: String },
        lastWatchedTime: { type: Number }, // วินาทีที่หยุดดู
        updatedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
