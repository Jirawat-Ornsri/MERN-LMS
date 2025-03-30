import express from "express";
import { getAllUsers, getSingleUser, updateVideoStatus, updateQuizStatus, getUserStatus, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.put("/update-profile", protectRoute, updateProfile);

router.post("/update-video-status", updateVideoStatus);
router.post("/update-quiz-status", updateQuizStatus);
router.get("/status/:userId", getUserStatus);

export default router;
