import React, { useEffect, useState } from "react";
import { usePostStore } from "../store/usePostStore";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react"; // ✅ เพิ่มไอคอนคอมเมนต์
import PostFormModal from "./PostFormModal";

const CommunityPage = () => {
  const { posts, fetchPosts, isLoading } = usePostStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto my-16">
        <h1 className="text-3xl font-bold mb-6 text-center">Community</h1>

        {/* ปุ่มสร้างโพสต์ */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <button onClick={() => setShowModal(true)} className="text-blue-500">
            + Create a Post
          </button>
        </div>

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="space-y-4">
            {posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center mb-3">
                    <img
                      src={post.userId?.profilePic || "/default-profile.png"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">{post.userId?.fullName || "Unknown User"}</p>
                      <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-700">{post.content.slice(0, 100)}...</p>

                  {/* เส้นแบ่งระหว่างเนื้อหาโพสต์และปุ่มแสดงความคิดเห็น */}
                  <hr className="my-2 border-gray-300" />

                  {/* ปุ่มแสดงความคิดเห็น พร้อมไอคอน */}
                  <Link to={`/community/post/${post._id}`} className="flex items-center text-blue-500 hover:underline">
                    <MessageCircle className="w-5 h-5 mr-1" /> แสดงความคิดเห็น
                  </Link>
                </div>
              ))}
          </div>
        )}

        {/* Modal สำหรับสร้างโพสต์ */}
        {showModal && <PostFormModal onClose={() => setShowModal(false)} refreshPosts={fetchPosts} />}
      </div>
    </div>
  );
};

export default CommunityPage;
