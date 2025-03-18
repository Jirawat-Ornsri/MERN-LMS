import mongoose from "mongoose";
import User from "../models/user.model.js";
import Course from "../models/course.model.js"; 
import Post from "../models/post.model.js";  // import โมเดล Post

// ฟังก์ชันสำหรับการสร้างโพสต์
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;  // ดึง title และ content จาก request body
    const { userId } = req.params;  // ดึง userId จาก params

    // ตรวจสอบว่า userId มีอยู่ในระบบหรือไม่
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    // สร้างโพสต์ใหม่
    const newPost = new Post({
      userId: userId,
      title: title,
      content: content,
    });

    // บันทึกโพสต์ในฐานข้อมูล
    await newPost.save();

    // ส่งข้อมูลโพสต์ที่สร้างกลับไป (MongoDB จะสร้าง _id อัตโนมัติ)
    res.status(201).json({
      message: "Post created successfully",
      postId: newPost._id,  // ใช้ _id แทน postId
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};