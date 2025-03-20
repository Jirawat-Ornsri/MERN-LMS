import mongoose from "mongoose";

// สร้าง Schema สำหรับ Comment
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,  // ต้องมีข้อความในการแสดงความคิดเห็น
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",  // เชื่อมโยงกับ Post
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // เชื่อมโยงกับ User
      required: true,
    },
  },
  { timestamps: true }  // บันทึกเวลาเมื่อสร้างและอัพเดทความคิดเห็น
);

// สร้างโมเดล Comment
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
