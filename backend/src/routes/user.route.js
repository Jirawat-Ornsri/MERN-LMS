import express from "express";
import { getAllUsers, getSingleUser, updateVideoStatus, updateQuizStatus, getUserStatus, saveQuizResult, showQuizResult,updateContinueWatching,
    getContinueWatching,saveContinueWatching,updateProfile} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.put("/update-profile", protectRoute, updateProfile);

router.post("/update-video-status", updateVideoStatus);
router.post("/update-quiz-status", updateQuizStatus);
router.get("/status/:userId", getUserStatus);
router.post("/save-quiz-result", saveQuizResult); 
router.get("/show-quiz-result/:userId/:quizId/:courseId", showQuizResult); 
router.post("/continue-watching", saveContinueWatching); // Save continue watching
router.get("/continue-watching/:userId/:courseId", getContinueWatching); // Get continue watching
router.put("/continue-watching/:userId/:courseId", updateContinueWatching); // Update continue watching
export default router;
