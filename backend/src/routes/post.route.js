import express from 'express';
import { getAllPosts, createPost, commentPost, getSinglePost, deletePost } from '../controllers/post.controller.js';

const router = express.Router();

router.get('/', getAllPosts); // ดึงโพสต์ทั้งหมด
router.post('/', createPost); // สร้างโพสต์ใหม่
router.post('/:postId/comment', commentPost); // คอมเมนต์โพสต์
router.get('/:postId', getSinglePost); // ดึงโพสต์เดี่ยว
router.delete('/:postId', deletePost); 

export default router;
