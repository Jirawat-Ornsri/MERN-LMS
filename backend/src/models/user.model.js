import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    completedVideos: [
      {
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        video_id: { type: String }
      }
    ],
    completedQuizzes: [
      {
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        quiz_id: { type: String }
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
