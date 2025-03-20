import Post from '../models/post.model.js';
import User from '../models/user.model.js';

// ฟังก์ชันสำหรับดึงโพสต์ทั้งหมด
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'fullName email profilePic') // ดึงข้อมูลผู้ใช้ที่เป็นเจ้าของโพสต์
      .populate('comments.userId', 'fullName email profilePic'); // ดึงข้อมูลผู้ใช้ที่คอมเมนต์

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ฟังก์ชันสำหรับสร้างโพสต์ใหม่
export const createPost = async (req, res) => {
  try {
    const { userId, title, content } = req.body; // รับข้อมูลจาก body

    // ตรวจสอบว่า userId ที่ส่งมาเป็น ID ที่ถูกต้องหรือไม่
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // สร้างโพสต์ใหม่
    const newPost = new Post({
      userId,
      title,
      content
    });

    // บันทึกโพสต์ลงในฐานข้อมูล
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ฟังก์ชันสำหรับเพิ่มคอมเมนต์ลงในโพสต์
export const commentPost = async (req, res) => {
  try {
    const { postId } = req.params; // รับ postId จาก params
    const { userId, comment } = req.body; // รับข้อมูลจาก body

    // ตรวจสอบว่า postId เป็น ID ที่ถูกต้องหรือไม่
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // ตรวจสอบว่า userId เป็น ID ที่ถูกต้องหรือไม่
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // ค้นหาโพสต์ที่ต้องการคอมเมนต์
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ค้นหาผู้ใช้ที่คอมเมนต์
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // เพิ่มคอมเมนต์ลงในโพสต์
    post.comments.push({
      userId,
      comment,
      timestamp: new Date()
    });

    // บันทึกการอัพเดตโพสต์
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ฟังก์ชันสำหรับดึงโพสต์เดียวตาม postId
export const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params; // รับ postId จาก params

    // ตรวจสอบว่า postId เป็น ID ที่ถูกต้องหรือไม่
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // ค้นหาโพสต์ตาม postId
    const post = await Post.findById(postId)
      .populate('userId', 'fullName email profilePic') // ดึงข้อมูลผู้ใช้ที่เป็นเจ้าของโพสต์
      .populate('comments.userId', 'fullName email profilePic'); // ดึงข้อมูลผู้ใช้ที่คอมเมนต์

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
