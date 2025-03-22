import React, { useState } from "react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const PostFormModal = ({ onClose, refreshPosts }) => {
  const { createPost } = usePostStore();
  const { authUser } = useAuthStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      toast.error("คุณต้องเข้าสู่ระบบก่อนโพสต์!");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }

    try {
      await createPost({
        title,
        content,
        userId: authUser._id,
      });

      toast.success("โพสต์สำเร็จ!");
      onClose(); // ปิด Modal
      refreshPosts(); // ✅ รีเฟรชโพสต์
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-300 p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Post 💬</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 rounded outline-none"
        />

        <textarea
          placeholder="Description..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-2 rounded h-24 resize-none outline-none"
        />

        <div className="flex justify-between mt-5">
          <button onClick={onClose} className="text-sm px-4 font-semibold py-2 bg-base-content text-base-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="text-sm font-semibold px-4 py-2 bg-primary text-base-300 rounded">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostFormModal;
