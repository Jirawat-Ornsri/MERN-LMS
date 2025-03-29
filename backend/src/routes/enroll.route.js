import express from "express";
import {
  enrollCourse,
  getEnrollments,
} from "../controllers/enroll.controller.js";

const router = express.Router();

// ลงทะเบียนเรียน
router.post("/", enrollCourse);

// ดึงข้อมูลคอร์สที่ผู้ใช้ลงทะเบียนเรียน
router.get("/:user_id", getEnrollments);


export default router;
