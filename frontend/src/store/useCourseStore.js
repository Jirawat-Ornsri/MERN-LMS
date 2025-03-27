import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";  // Assuming axiosInstance is configured in libs/axios.js
import toast from "react-hot-toast";

export const useCourseStore = create((set, get) => ({
  courses: [],
  course: null,
  isFetchingCourses: false,
  isFetchingCourse: false,
  error: null,

  // Fetch all courses
  getCourses: async () => {
    set({ isFetchingCourses: true, error: null });
    try {
      const res = await axiosInstance.get("/api/course");
      set({ courses: res.data });
      // toast.success("Courses fetched successfully");
    } catch (error) {
      console.error("Error fetching courses:", error);
      set({ error: error.response?.data?.message || "Error fetching courses" });
      toast.error("Error fetching courses");
    } finally {
      set({ isFetchingCourses: false });
    }
  },

  // Fetch a single course by ID
  getCourseById: async (id) => {
    set({ isFetchingCourse: true, error: null });
    try {
      const res = await axiosInstance.get(`/api/course/${id}`);
      set({ course: res.data });
      // toast.success("Course fetched successfully");
    } catch (error) {
      console.error("Error fetching course:", error);
      set({ error: error.response?.data?.message || "Error fetching course" });
      toast.error("Error fetching course");
    } finally {
      set({ isFetchingCourse: false });
    }
  },


}));
