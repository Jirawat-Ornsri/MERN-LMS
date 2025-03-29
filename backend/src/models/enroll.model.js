import mongoose from "mongoose";

const enrollSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    enrolled_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Enroll = mongoose.model("Enroll", enrollSchema);
export default Enroll;
