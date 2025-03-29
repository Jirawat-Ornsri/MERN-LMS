import express from 'express';
import { getAllReviews, createReview, getReviewsByCourse } from '../controllers/review.controller.js';

const router = express.Router();

router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/course/:courseId', getReviewsByCourse);

export default router;
