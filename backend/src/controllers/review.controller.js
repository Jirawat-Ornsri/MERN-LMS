import Review from '../models/review.model.js';
import User from '../models/user.model.js';
import Course from '../models/course.model.js';

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'fullName email profilePic')
      .populate('courseId', 'title');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createReview = async (req, res) => {
  try {
    const { userId, courseId, rating, title, content } = req.body;

    if (![1, 2, 3, 4, 5].includes(rating)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!user || !course) {
      return res.status(404).json({ message: 'User or Course not found' });
    }

    const newReview = new Review({ userId, courseId, rating, title, content });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getReviewsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ courseId })
      .populate('userId', 'fullName email profilePic');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};