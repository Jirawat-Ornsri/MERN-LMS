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
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">สร้างโพสต์</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="หัวข้อโพสต์"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />

        <textarea
          placeholder="รายละเอียดโพสต์..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded h-24"
        />

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">ยกเลิก</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
            โพสต์
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostFormModal;
