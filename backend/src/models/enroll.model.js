import mongoose from "mongoose";

const enrollSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    enrolled_at: { type: Date, default: Date.now },
    progress: [
      {
        lesson_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // เปลี่ยนเป็น ObjectId
        title: { type: String, required: true }, // เก็บชื่อบทเรียน
        videos: [
          {
            video_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // เปลี่ยนเป็น ObjectId
            title: { type: String, required: true }, // ชื่อวิดีโอ
            completed: { type: Boolean, default: false }
          }
        ],
        quiz: {
          quiz_id: { type: mongoose.Schema.Types.ObjectId }, // เปลี่ยนเป็น ObjectId
          title: { type: String },
          questions: [
            {
              question_id: { type: mongoose.Schema.Types.ObjectId },
              question: { type: String },
              answer: { type: String },
              completed: { type: Boolean, default: false }
            }
          ],
          completed: { type: Boolean, default: false }
        },
        is_completed: { type: Boolean, default: false } // เช็คว่าจบบทนี้แล้วหรือยัง
      }
    ],
    status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" } // สถานะคอร์ส
  },
  { timestamps: true }
);

const Enroll = mongoose.model("Enroll", enrollSchema);
export default Enroll;
