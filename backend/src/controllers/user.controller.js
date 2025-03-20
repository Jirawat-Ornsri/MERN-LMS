import User from "../models/user.model.js";
import Course from "../models/course.model.js";
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

// ลงทะเบียนคอร์สเรียน
export const enrollCourse = async (req, res) => {
  try {
    const { userId } = req.body;
    const { courseId } = req.params;

    // ตรวจสอบว่าทั้ง userId และ courseId ถูกต้องหรือไม่
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID or course ID" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!course) return res.status(404).json({ message: "Course not found" });

    // ตรวจสอบว่าลงทะเบียนแล้วหรือยัง
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: "Successfully enrolled in course", enrolledCourses: user.enrolledCourses });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
