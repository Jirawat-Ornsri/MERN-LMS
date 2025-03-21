import express from "express";
import { getAllUsers, getSingleUser, updateVideoStatus, updateQuizStatus, getUserStatus } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.post("/update-video-status", updateVideoStatus);
router.post("/update-quiz-status", updateQuizStatus);
router.get("/status/:userId", getUserStatus);

export default router;
