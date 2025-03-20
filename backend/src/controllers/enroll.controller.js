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

// อัปเดตความคืบหน้าของวิดีโอ
export const updateVideoProgress = async (req, res) => {
  try {
    const { enrollment_id, lesson_id, video_id } = req.body;

    const enrollment = await Enroll.findById(enrollment_id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // ค้นหาบทเรียน
    const lesson = enrollment.progress.find(lesson => lesson.lesson_id.toString() === lesson_id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // อัปเดตสถานะวิดีโอเป็นเรียนจบ
    const video = lesson.videos.find(video => video.video_id.toString() === video_id);
    if (video) {
      video.completed = true;
    }

    // เช็กว่าทุกวิดีโอในบทเรียนนี้เรียนจบหรือยัง
    lesson.is_completed = lesson.videos.every(video => video.completed);
    
    await enrollment.save();
    res.status(200).json({ message: "Video progress updated", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// อัปเดตความคืบหน้าของแบบทดสอบ
export const updateQuizProgress = async (req, res) => {
  try {
    const { enrollment_id, lesson_id, quiz_id } = req.body;

    const enrollment = await Enroll.findById(enrollment_id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // ค้นหาบทเรียน
    const lesson = enrollment.progress.find(lesson => lesson.lesson_id.toString() === lesson_id);
    if (!lesson || !lesson.quiz || lesson.quiz.quiz_id.toString() !== quiz_id) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // อัปเดตสถานะแบบทดสอบ
    lesson.quiz.completed = true;

    // เช็กว่าทุกวิดีโอและแบบทดสอบของบทเรียนนี้เสร็จหรือยัง
    lesson.is_completed = lesson.videos.every(video => video.completed) && lesson.quiz.completed;

    await enrollment.save();
    res.status(200).json({ message: "Quiz progress updated", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ตรวจสอบว่านักเรียนเรียนจบคอร์สหรือยัง
export const checkCourseCompletion = async (req, res) => {
  try {
    const { enrollment_id } = req.params;

    const enrollment = await Enroll.findById(enrollment_id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // ถ้าทุกบทเรียนในคอร์สเรียนจบแล้ว อัปเดตสถานะคอร์สเป็น "completed"
    const allLessonsCompleted = enrollment.progress.every(lesson => lesson.is_completed);
    enrollment.status = allLessonsCompleted ? "completed" : "in_progress";

    await enrollment.save();
    res.status(200).json({ message: "Course completion checked", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
