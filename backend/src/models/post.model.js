import mongoose from "mongoose";

// สร้าง Schema สำหรับ Post
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true }); // ใช้ timestamps สำหรับ createdAt และ updatedAt

const Post = mongoose.model("Post", postSchema);

export default Post;
