import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js"; 
// ฟังก์ชันสำหรับการแสดงความคิดเห็นใต้โพสต์
export const createComment = async (req, res) => {
  try {
    const { comment } = req.body;  // ดึงข้อความความคิดเห็นจาก request body
    const { postId, userId } = req.params;  // ดึง postId และ userId จาก params

    // ตรวจสอบว่า userId มีอยู่ในระบบหรือไม่
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ตรวจสอบว่า content (comment) ไม่เป็นค่าว่าง
    if (!comment) {
      return res.status(400).json({ message: "Comment content is required." });
    }

    // ค้นหาโพสต์ที่ต้องการเพิ่มความคิดเห็น (ใช้ _id แทน postId)
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // เพิ่มความคิดเห็นใหม่เข้าไปใน Array ของ comments
    post.comments.push({
      userId: userId,
      comment: comment,
      timestamp: new Date(),  // เก็บเวลาแสดงความคิดเห็น
    });

    // บันทึกโพสต์ที่อัพเดทในฐานข้อมูล
    await post.save();

    // ส่งข้อมูลความคิดเห็นกลับ
    res.status(201).json({
      message: "Comment added successfully",
      comment: {
        userId: userId,
        comment: comment,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};