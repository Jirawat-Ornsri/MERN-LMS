import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import cloudinary from "../lib/cloudinary.js";

// ดึงข้อมูลผู้ใช้ทั้งหมด
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("fullName email profilePic createdAt");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ดึงข้อมูลผู้ใช้รายบุคคล
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่า ID ถูกต้องหรือไม่
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password"); // ไม่รวม password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, interests } = req.body;
    const userId = req.user._id;

    const updateFields = {};

    
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateFields.profilePic = uploadResponse.secure_url;
    }
    
    if (fullName) {
      updateFields.fullName = fullName;
    }

    if (interests) {
      updateFields.interests = interests;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// อัปเดตสถานะการดูวิดีโอ
export const updateVideoStatus = async (req, res) => {
  try {
    const { userId, videos, courseId } = req.body; // รองรับหลายวิดีโอ
    if (!userId || !videos || !courseId) return res.status(400).json({ message: "Missing userId, videos, or courseId" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // เพิ่มข้อมูลวิดีโอที่ผู้ใช้ดูแล้ว
    videos.forEach((videoId) => {
      const videoIndex = user.completedVideos.findIndex(
        (v) => v.video_id === videoId && v.course_id.toString() === courseId
      );

      if (videoIndex === -1) {
        user.completedVideos.push({ course_id: courseId, video_id: videoId });
      }
    });

    await user.save();
    res.status(200).json({ message: "Video status updated", completedVideos: user.completedVideos });
  } catch (error) {
    console.error("Error updating video status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// อัปเดตสถานะควิซ
export const updateQuizStatus = async (req, res) => {
  try {
    const { userId, quizIds, courseId } = req.body;

    // ค้นหาผู้ใช้จาก MongoDB โดยใช้ userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ตรวจสอบว่า quizIds อยู่ใน completedQuizzes หรือไม่
    const quizExists = user.completedQuizzes.some(
      (q) => quizIds.includes(q.quiz_id) && q.course_id.toString() === courseId
    );

    // ถ้าไม่พบ quiz ให้เพิ่มใหม่
    if (!quizExists) {
      quizIds.forEach(quizId => {
        user.completedQuizzes.push({
          course_id: courseId,
          quiz_id: quizId,
        });
      });
      await user.save();
      return res.status(200).json({ message: 'Quiz status updated successfully' });
    } else {
      return res.status(200).json({ message: 'Quiz already completed' });
    }
  } catch (error) {
    console.error('Error updating quiz status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ดึงสถานะของผู้ใช้
export const getUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("completedVideos completedQuizzes enrolledCourses");
    if (!user) return res.status(404).json({ message: "User not found" });

    // ดึงข้อมูลคอร์สที่ผู้ใช้ลงทะเบียน
    const enrolledCourses = await Course.find({ '_id': { $in: user.enrolledCourses } });

    const completedVideos = user.completedVideos.map((video) => ({
      courseId: video.course_id,
      videoId: video.video_id,
    }));

    const completedQuizzes = user.completedQuizzes.map((quiz) => ({
      courseId: quiz.course_id,
      quizId: quiz.quiz_id,
    }));

    res.status(200).json({ completedVideos, completedQuizzes, enrolledCourses });
  } catch (error) {
    console.error("Error fetching user status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
