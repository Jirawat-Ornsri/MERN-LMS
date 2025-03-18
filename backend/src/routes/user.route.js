import express from "express";
import { getAllUsers, getSingleUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.post("/enroll/:courseId", enrollCourse); // เพิ่มฟังก์ชันลงทะเบียน

export default router;
