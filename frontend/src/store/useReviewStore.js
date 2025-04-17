import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";

export const useReviewStore = create((set, get) => ({
  reviews: [],
  selectedReviews: [],
  isLoading: false,

  // ดึงรีวิวทั้งหมด
  fetchReviews: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/reviews/");
      set({ reviews: res.data });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      set({ isLoading: false });
    }
  },

  // สร้างรีวิวใหม่
  createReview: async (data) => {
    try {
      const res = await axiosInstance.post("/reviews/", data);
      set((state) => ({ reviews: [res.data, ...state.reviews] }));
      toast.success("Review created successfully");
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error(error.response?.data?.message || "Failed to create review");
    }
  },

  // ดึงรีวิวตามคอร์ส
  fetchReviewsByCourse: async (courseId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/reviews/course/${courseId}`);
      set({ selectedReviews: res.data });
    } catch (error) {
      console.error("Error fetching reviews for course:", error);
      toast.error("Failed to load course reviews");
    } finally {
      set({ isLoading: false });
    }
  },
}));
