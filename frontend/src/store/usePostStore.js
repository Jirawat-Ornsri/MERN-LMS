import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import toast from "react-hot-toast";

export const usePostStore = create((set, get) => ({
  posts: [],
  selectedPost: null,
  isLoading: false,

  // ดึงโพสต์ทั้งหมดในหน้า community
  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/api/post/");
      set({ posts: res.data });
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      set({ isLoading: false });
    }
  },

  // โพสต์คำถามใหม่
  createPost: async (data) => {
    try {
      const res = await axiosInstance.post("/api/post/", data);
      set((state) => ({ posts: [res.data, ...state.posts] }));
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  },

  // ดึงโพสต์เดี่ยวตาม ID
  fetchSinglePost: async (postId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/api/post/${postId}`);
      set({ selectedPost: res.data });
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
    } finally {
      set({ isLoading: false });
    }
  },

  // คอมเมนต์ใต้โพสต์
  addComment: async (postId, data) => {
    try {
      const res = await axiosInstance.post(`/api/post/${postId}/comment`, data);
      set((state) => ({
        selectedPost: res.data,
        posts: state.posts.map((post) => (post._id === postId ? res.data : post)),
      }));
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  },
}));
