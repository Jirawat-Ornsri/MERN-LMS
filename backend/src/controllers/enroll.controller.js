import Enroll from "../models/enroll.model.js";
import Course from "../models/course.model.js"; // ดึงข้อมูลคอร์ส
import User from "../models/user.model.js"; // ดึงข้อมูลผู้ใช้

// ลงทะเบียนเรียนในคอร์ส
export const enrollCourse = async (req, res) => {
  try {
    const { user_id, course_id } = req.body;

    // ตรวจสอบว่าผู้ใช้และคอร์สมีอยู่จริง
    const userExists = await User.findById(user_id);
    const courseExists = await Course.findById(course_id);

    if (!userExists || !courseExists) {
      return res.status(404).json({ message: "User or Course not found" });
    }

    // ตรวจสอบว่าลงทะเบียนเรียนไปแล้วหรือยัง
    const existingEnrollment = await Enroll.findOne({ user_id, course_id });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // สร้างรายการลงทะเบียนเรียนใหม่
    const enrollment = new Enroll({ user_id, course_id });
    await enrollment.save();

    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ดึงข้อมูลคอร์สที่ผู้ใช้ลงทะเบียนเรียน
export const getEnrollments = async (req, res) => {
  try {
    const { user_id } = req.params;
    const enrollments = await Enroll.find({ user_id }).populate("course_id");

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
