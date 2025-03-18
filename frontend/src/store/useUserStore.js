import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";  // ใช้ axiosInstance ที่ตั้งค่าไว้
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  users: [],
  user: null,
  isFetchingUsers: false,
  isFetchingUser: false,
  error: null,

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  getAllUsers: async () => {
    set({ isFetchingUsers: true, error: null });
    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data });
      // toast.success("Fetched users successfully");
    } catch (error) {
    //   console.error("Error fetching users:", error);
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
    //   console.log("Fetched user:", res.data); // ตรวจสอบ response
      set({ user: res.data });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ error: error.response?.data?.message || "Error fetching user" });
      toast.error("Error fetching user");
    } finally {
      set({ isFetchingUser: false });
    }
  },
  
}));
