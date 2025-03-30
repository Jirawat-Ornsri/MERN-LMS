import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  users: [],
  user: null,
  completedVideos: new Set(),
  completedQuizzes: new Set(),
  isFetchingUsers: false,
  isFetchingUser: false,
  error: null,
  isPartyActive: false,

  startParty: () => set({ isPartyActive: true }),
  stopParty: () => set({ isPartyActive: false }),

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  getAllUsers: async () => {
    set({ isFetchingUsers: true, error: null });
    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching users" });
      toast.error("Error fetching users");
    } finally {
      set({ isFetchingUsers: false });
    }
  },

  // ดึงข้อมูลผู้ใช้รายบุคคล
  getSingleUser: async (id) => {
    set({ isFetchingUser: true, error: null });
    try {
      const res = await axiosInstance.get(`/users/${id}`);
      set({ user: res.data });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ error: error.response?.data?.message || "Error fetching user" });
      toast.error("Error fetching user");
    } finally {
      set({ isFetchingUser: false });
    }
  },

  // ✅ อัปเดตโปรไฟล์
  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/users/update-profile", data);
      set({ user: res.data }); // อัปเดตข้อมูลผู้ใช้ใน store
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  },

  // ✅ ดึงสถานะวิดีโอและควิซ
  fetchUserStatus: async (userId, courseId) => {
    try {
      const res = await axiosInstance.get(`/users/status/${userId}`);
      const data = res.data;

      const completedVideosResponse = data.completedVideos || [];
      const completedQuizzesResponse = data.completedQuizzes || [];

      const currentCourseVideos = completedVideosResponse.filter(
        (item) => item.courseId === courseId
      );
      const currentCourseQuizzes = completedQuizzesResponse.filter(
        (item) => item.courseId === courseId
      );

      set({
        completedVideos: new Set(
          currentCourseVideos.map((item) => item.videoId)
        ),
        completedQuizzes: new Set(
          currentCourseQuizzes.map((item) => item.quizId)
        ),
      });
    } catch (error) {
      console.error("Error fetching user status:", error);
      toast.error("Error fetching user status");
    }
  },

  // ✅ อัปเดตสถานะวิดีโอ
  updateVideoStatus: async (userId, videoId, courseId) => {
    try {
      const { completedVideos } = get();
      if (!completedVideos.has(videoId)) {
        await axiosInstance.post("/users/update-video-status", {
          userId,
          videos: [videoId],
          courseId,
        });
        set({
          completedVideos: new Set([...completedVideos, videoId]),
        });
        toast("Congratulations!", { icon: "🥳" });
        get().startParty(); // ✅ เรียก startParty()
        setTimeout(() => get().stopParty(), 6000); // ✅ ปิด effect หลัง 6 วินาที
      } else {
        console.log("Video already completed");
      }
    } catch (error) {
      console.error("Error updating video status:", error);
      toast.error("Error updating video status");
    }
  },

  // ✅ อัปเดตสถานะควิซ
  updateQuizStatus: async (userId, quizId, courseId) => {
    try {
      const { completedQuizzes } = get();
      if (!completedQuizzes.has(quizId)) {
        // เปลี่ยนชื่อ & เช็ก quizId เดียว
        await axiosInstance.post("/users/update-quiz-status", {
          userId,
          quizIds: [quizId], // Array ถูกต้อง
          courseId,
        });
        set({
          completedQuizzes: new Set([...completedQuizzes, quizId]),
        });
        toast("Congratulations!", { icon: "🥳" });
        get().startParty(); // ✅ เรียก startParty()
        setTimeout(() => get().stopParty(), 6000); // ✅ ปิด effect หลัง 6 วินาที
      }
    } catch (error) {
      console.error("Error updating quiz status:", error);
      toast.error("Error updating quiz status");
    }
  },

  // ✅ ดึงสถานะการเรียนของผู้ใช้
  getUserStatus: async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/status/${userId}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching user status:", error);
      toast.error("Error fetching user status");
      return null;
    }
  },

  // ฟังก์ชันใหม่ดึงข้อมูลคอร์สและสถานะการเรียน
  fetchCourseStatus: async (enrollmentId, userId) => {
    try {
      const res = await axiosInstance.get(`/users/status/${userId}`);
      const data = res.data;

      const completedVideosResponse = data.completedVideos || [];
      const completedQuizzesResponse = data.completedQuizzes || [];

      const currentCourseVideos = completedVideosResponse.filter(
        (item) => item.courseId === enrollmentId
      );
      const currentCourseQuizzes = completedQuizzesResponse.filter(
        (item) => item.courseId === enrollmentId
      );

      set({
        completedVideos: new Set(
          currentCourseVideos.map((item) => item.videoId)
        ),
        completedQuizzes: new Set(
          currentCourseQuizzes.map((item) => item.quizId)
        ),
      });
    } catch (error) {
      console.error("Error fetching course status:", error);
      toast.error("Error fetching course status");
    }
  },
}));
