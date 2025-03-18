import express from "express";
import { 
  getCourses, 
  getCourseById, 
  getCourseLessons,
} from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.get("/:id/lessons", getCourseLessons);

export default router;
