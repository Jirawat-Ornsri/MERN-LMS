import mongoose from "mongoose";

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
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
