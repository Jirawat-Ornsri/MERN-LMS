import express from "express";
import { createComment } from "../controllers/comment.controller.js";

const router = express.Router();

// เส้นทางสำหรับการสร้างความคิดเห็นใต้โพสต์
router.post("/:userId/post/:postId", createComment);

export default router;
