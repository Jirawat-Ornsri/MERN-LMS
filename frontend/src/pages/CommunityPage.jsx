import React, { useEffect, useState } from "react";
import { usePostStore } from "../store/usePostStore";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import PostFormModal from "../components/PostFormModal";
import Header from "../components/Header";
import { SquarePen } from "lucide-react";

const CommunityPage = () => {
  const { posts, fetchPosts, isLoading } = usePostStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto my-16">
        <Header text1={"Community"} />

        {/* ปุ่มสร้างโพสต์ */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-4 right-4 w-14 h-14 flex items-center justify-center rounded-full bg-primary shadow-lg z-50"
        >
          <SquarePen className="w-6 h-6 text-secondary-content" />
        </button>

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="space-y-4">
            {posts
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                <div key={post._id} className="p-4 rounded-lg shadow bg-base-300 text-base-content">
                  <div className="flex items-center mb-3">
                    <img
                      src={post.userId?.profilePic || "/default-profile.png"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">
                        {post.userId?.fullName || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-500">
                    {post.content.slice(0, 100)}...
                  </p>

                  {/* เส้นแบ่งระหว่างเนื้อหาโพสต์และปุ่มแสดงความคิดเห็น */}
                  <hr className="my-2" />

                  {/* ปุ่มแสดงความคิดเห็น พร้อมไอคอน */}
                  <Link
                    to={`/community/post/${post._id}`}
                    className="flex items-center text-primary font-semibold"
                  >
                    <MessageCircle className="w-5 h-5 mr-1" /> Comments
                  </Link>
                </div>
              ))}
          </div>
        )}

        {/* Modal สำหรับสร้างโพสต์ */}
        {showModal && (
          <PostFormModal
            onClose={() => setShowModal(false)}
            refreshPosts={fetchPosts}
          />
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
