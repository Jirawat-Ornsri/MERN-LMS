import express from "express";
import {
  enrollCourse,
  getEnrollments,
  updateVideoProgress,
  updateQuizProgress,
  checkCourseCompletion
} from "../controllers/enroll.controller.js";

const router = express.Router();

// ลงทะเบียนเรียน
router.post("/", enrollCourse);

// ดึงข้อมูลคอร์สที่ผู้ใช้ลงทะเบียนเรียน
router.get("/:user_id", getEnrollments);

// อัปเดตความคืบหน้าของวิดีโอ
router.patch("/progress/video", updateVideoProgress);

// อัปเดตความคืบหน้าของแบบทดสอบ
router.patch("/progress/quiz", updateQuizProgress);

// ตรวจสอบว่านักเรียนเรียนจบคอร์สหรือยัง
router.get("/completion/:enrollment_id", checkCourseCompletion);

export default router;
