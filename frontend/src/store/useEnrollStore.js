import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";

export const useEnrollStore = create((set, get) => ({
  enrollments: [],
  isFetching: false,
  error: null,

  // ลงทะเบียนเรียน
  enrollCourse: async (user_id, course_id) => {
    try {
      const res = await axiosInstance.post("/enroll", { user_id, course_id });
      set((state) => ({ enrollments: [...state.enrollments, res.data.enrollment] }));
      toast.success("Enrolled successfully");
    } catch (error) {
      console.error("Error enrolling in course:", error);
      set({ error: error.response?.data?.message || "Error enrolling" });
      toast.error("Error enrolling in course");
    }
  },

  // ดึงข้อมูลคอร์สที่ลงทะเบียนเรียน
  getEnrollments: async (user_id) => {
    set({ isFetching: true, error: null });
    try {
      const res = await axiosInstance.get(`/enroll/${user_id}`);
      set({ enrollments: res.data });
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      set({ error: error.response?.data?.message || "Error fetching enrollments" });
      toast.error("Error fetching enrollments");
    } finally {
      set({ isFetching: false });
    }
  },

  // อัปเดตความคืบหน้าของวิดีโอ
  updateVideoProgress: async (enrollment_id, lesson_id, video_id) => {
    try {
      const res = await axiosInstance.patch("/enroll/video-progress", { enrollment_id, lesson_id, video_id });
      set((state) => ({
        enrollments: state.enrollments.map((enroll) =>
          enroll._id === enrollment_id ? res.data.enrollment : enroll
        ),
      }));
      toast.success("Video progress updated");
    } catch (error) {
      console.error("Error updating video progress:", error);
      toast.error("Error updating video progress");
    }
  },

  // อัปเดตความคืบหน้าของแบบทดสอบ
  updateQuizProgress: async (enrollment_id, lesson_id, quiz_id) => {
    try {
      const res = await axiosInstance.patch("/enroll/quiz-progress", { enrollment_id, lesson_id, quiz_id });
      set((state) => ({
        enrollments: state.enrollments.map((enroll) =>
          enroll._id === enrollment_id ? res.data.enrollment : enroll
        ),
      }));
      toast.success("Quiz progress updated");
    } catch (error) {
      console.error("Error updating quiz progress:", error);
      toast.error("Error updating quiz progress");
    }
  },

  // ตรวจสอบสถานะคอร์ส
  checkCourseCompletion: async (enrollment_id) => {
    try {
      const res = await axiosInstance.get(`/enroll/check-completion/${enrollment_id}`);
      set((state) => ({
        enrollments: state.enrollments.map((enroll) =>
          enroll._id === enrollment_id ? res.data.enrollment : enroll
        ),
      }));
      toast.success("Course completion checked");
    } catch (error) {
      console.error("Error checking course completion:", error);
      toast.error("Error checking course completion");
    }
  },
}));
