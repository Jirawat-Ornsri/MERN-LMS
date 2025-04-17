import mongoose from 'mongoose';

// สร้าง Schema สำหรับ Post
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      require:true
    },
    content: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // เชื่อมโยงกับ User model
      required: true
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // เชื่อมโยงกับ User model
          required: true
        },
        comment: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true // จะสร้าง createdAt และ updatedAt อัตโนมัติ
  }
);

// สร้าง Post model
const Post = mongoose.model('Post', postSchema);

export default Post;
