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

  // ✅ ดึงสถานะวิดีโอ
fetchUserStatus: async (userId, courseId) => {
  try {
    const res = await axiosInstance.get(`/users/status/${userId}`);
    const data = res.data;

    const completedVideosResponse = data.completedVideos || [];

    // กรองวิดีโอที่เกี่ยวข้องกับคอร์สปัจจุบัน
    const currentCourseVideos = completedVideosResponse.filter(item => item.courseId === courseId);

    // เก็บผลลัพธ์ใน state
    set({
      completedVideos: new Set(currentCourseVideos.map(item => item.videoId)), // ใช้ videoId เก็บใน Set
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
        toast('Congratulations!', { icon: '🥳'})
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
  
      const currentCourseVideos = completedVideosResponse.filter(item => item.courseId === enrollmentId);
      const currentCourseQuizzes = completedQuizzesResponse.filter(item => item.courseId === enrollmentId);
  
      set({
        completedVideos: new Set(currentCourseVideos.map(item => item.videoId)),
        completedQuizzes: new Set(currentCourseQuizzes.map(item => item.quizId)),
      });
    } catch (error) {
      console.error("Error fetching course status:", error);
      toast.error("Error fetching course status");
    }
  },

// ฟังก์ชันสำหรับบันทึกผลลัพธ์ควิซ
// ฟังก์ชันสำหรับบันทึกผลลัพธ์ควิซ
saveQuizResult: async (userId, courseId, quizId, answers, totalQuestions, score) => {
  const state = get(); // ดึงค่าปัจจุบันของ state
  const completedQuizzes = state.completedQuizzes;

  // ตรวจสอบว่าควิซนี้ถูกบันทึกไปแล้วหรือยัง
  if (completedQuizzes.has(quizId)) {
    console.log("Quiz already completed and saved.");
    return; // ไม่บันทึกซ้ำ
  }

  try {
    // ส่งข้อมูลไปยัง API
    await axiosInstance.post("http://localhost:5001/api/users/save-quiz-result", {
      userId,
      courseId,
      quizId,
      answers: answers.map((q) => ({
        questionId: q.questionId,
        answer: q.selectedAnswer,
        isCorrect: q.isCorrect,
      })),
      totalQuestions,
      score,
    });

    // อัปเดต completedQuizzes โดยใช้ set() ของ Zustand
    set({
      completedQuizzes: new Set([...completedQuizzes, quizId]), // เพิ่ม quizId ลงใน completedQuizzes
    });

    // แสดงผล toast และเริ่ม party effect เพียงครั้งเดียว
    if (!state.isPartyActive) {  // ใช้สถานะ isPartyActive เพื่อตรวจสอบว่า party effect ยังไม่ได้เริ่ม
      toast.success("Quiz result saved successfully!");
      toast('Congratulations!', { icon: '🥳' });
      state.startParty(); // เรียกใช้งานฟังก์ชันที่เกี่ยวข้องใน state
      setTimeout(() => state.stopParty(), 6000); // หยุด party effect หลังจาก 6 วินาที
    }
  } catch (error) {
    toast.error("Error saving quiz result");
    console.error("Error saving quiz result:", error);
  }
},

// ฟังก์ชันใหม่ดึงข้อมูลผลลัพธ์ของ Quiz จาก API
getQuizResult: async (userId, quizId, courseId) => {
  try {
    const res = await axiosInstance.get(`/users/show-quiz-result/${userId}/${quizId}/${courseId}`);
    return res.data; // ส่งกลับผลลัพธ์ของ quiz
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // ถ้าได้รับ 404 แสดงว่าไม่มีข้อมูลในฐานข้อมูล จึงไม่จำเป็นต้องแสดง popup
    } else {
      // ถ้าเกิดข้อผิดพลาดอื่นๆ ให้แสดงข้อความแจ้งเตือน
      toast.error("Error fetching quiz result");
    }
    return null;
  }
},


// ฟังก์ชัน continueWatching
continueWatching: async (userId, courseId, videoId, currentTime) => {
  try {
    videoId = String(videoId); // ✅ แปลงเป็น String

    // ดึงข้อมูลเดิม
    const existingData = await axiosInstance.get(`/users/continue-watching/${userId}/${courseId}`);
    const existingVideos = existingData.data?.continueWatching || [];

    const existingVideo = existingVideos.find(item => 
      String(item.video_id) === videoId && String(item.course_id) === String(courseId)
    );

    if (existingVideo) {
      if (existingVideo.lastWatchedTime !== currentTime) {
        console.log("Updating video data...");

        await axiosInstance.put(`/users/continue-watching/${userId}/${courseId}`, {
          userId,
          courseId,
          videoId,
          lastWatchedTime: currentTime
        });

        set({
          continueWatchingData: existingVideos.map(item => 
            item.video_id === videoId ? { ...item, lastWatchedTime: currentTime } : item
          ),
        });

      } else {
        console.log("No changes in lastWatchedTime, skipping update.");
      }
    } else {
      if (currentTime > 0) {
        console.log("Saving new video data...");

        await axiosInstance.post(`/users/continue-watching`, {
          userId,
          courseId,
          videoId,
          lastWatchedTime: currentTime
        });

        set({
          continueWatchingData: [...existingVideos, {
            video_id: videoId,
            course_id: courseId,
            lastWatchedTime: currentTime
          }],
        });
      }
    }

  } catch (error) {
    console.error("❌ Error updating continue watching data:", error);
    toast.error("Error updating continue watching data");
  }
},


// ดึงข้อมูล Video ที่ดูล่าสุด
getContinueWatching: async (userId, courseId) => {
  try {
    const res = await axiosInstance.get(`/users/continue-watching/${userId}/${courseId}`);
    return res.data; // { videoId, lastWatchedTime }
  } catch (error) {
    console.error("Error fetching continue watching data:", error);
    return null;
  }
},



}));

