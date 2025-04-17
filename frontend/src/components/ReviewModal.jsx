import React, { useState } from "react";
import { useReviewStore } from "../store/useReviewStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

const ReviewModal = ({ onClose, courseId }) => {
  const { createReview } = useReviewStore();
  const { authUser } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!authUser) {
      toast.error("คุณต้องเข้าสู่ระบบก่อนรีวิว!");
      return;
    }
  
    if (!title.trim() || !content.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }
  
    const reviewData = {
      courseId,
      userId: authUser._id,
      rating,
      title,
      content,
    };
  
    try {
      await createReview(reviewData);
      onClose();     
    } catch (err) {
      console.error("Error creating review:", err); // ✅ ดูรายละเอียดข้อผิดพลาด
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-300 p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Review Course</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 rounded outline-none"
        />

        <textarea
          placeholder="Write your review..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-2 rounded h-24 resize-none outline-none"
        />

         {/* Star Rating */}
         <div className="flex justify-center gap-1 mb-10 mt-5">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              className={`w-8 h-8 cursor-pointer ${num <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
              onClick={() => setRating(num)}
            />
          ))}
        </div>

        <div className="flex justify-between mt-5">
          <button onClick={onClose} className="text-sm px-4 font-semibold py-2 bg-base-content text-base-300 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="text-sm font-semibold px-4 py-2 bg-primary text-base-300 rounded">
            Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
