import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // เชื่อมโยงกับ Course model
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // เชื่อมโยงกับ User model
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// สร้าง Review model
const Review = mongoose.model('Review', reviewSchema);

export default Review;