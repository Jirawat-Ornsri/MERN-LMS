import express from "express";
import { createPost } from "../controllers/post.controller.js";

const router = express.Router();

// เส้นทางสำหรับการสร้างโพสต์
router.post("/:userId", createPost);

export default router;
