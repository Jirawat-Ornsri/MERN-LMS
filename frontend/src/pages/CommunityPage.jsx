import React, { useEffect, useState } from "react";
import { usePostStore } from "../store/usePostStore";
import { Link } from "react-router-dom";
import { MessageCircle, Loader } from "lucide-react";
import PostFormModal from "../components/PostFormModal";
import Header from "../components/Header";
import { SquarePen, ChevronDown, ChevronRight } from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";

const CommunityPage = () => {
  const { posts, fetchPosts, isLoading } = usePostStore();
  const { courses, getCourses } = useCourseStore();

  const [showModal, setShowModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Fetch courses on component mount
  useEffect(() => {
    if (courses.length === 0) {
      // Only fetch if no courses are available
      getCourses();
    }
  }, [courses, getCourses]);

  // ดึง Subject ทั้งหมดโดยไม่ซ้ำ
  const subjects = [...new Set(courses.map((course) => course.subject))];

  // อัปเดตค่า Checkbox
  const handleTagsChange = (subject) => {
    setSelectedTags((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // ฟังก์ชันกรองคอร์ส
  const filteredPosts = posts.filter((post) => {
    return (
      selectedTags.length === 0 ||
      post.tags?.some((tag) => selectedTags.includes(tag))
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto my-16">
        <Header text1={"Community"} />
        {/* Sidebar (Responsive All Screens) */}
        <div className="mb-5">
          <button
            className="flex items-center gap-2 text-xl font-bold mb-4"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            FILTERS{" "}
            {isSidebarOpen ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {isSidebarOpen && (
            <div className="p-4 mt-2 rounded-lg bg-base-200 text-base-content">
              <h2 className="text-lg font-bold mb-3">FILTERS BY TAGS</h2>
              <ul>
                {subjects.map((subject) => (
                  <li key={subject} className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id={subject}
                      checked={selectedTags.includes(subject)}
                      onChange={() => handleTagsChange(subject)}
                      className="cursor-pointer"
                    />
                    <label htmlFor={subject} className="cursor-pointer">
                      {subject}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ปุ่มสร้างโพสต์ */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-4 right-4 w-14 h-14 flex items-center justify-center rounded-full bg-primary shadow-lg z-50"
        >
          <SquarePen className="w-6 h-6 text-secondary-content" />
        </button>

        <div className="space-y-4">
          {filteredPosts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post) => (
              <div
                key={post._id}
                className="p-4 rounded-lg shadow bg-base-300 text-base-content"
              >
                <div className="flex items-center mb-3">
                  <img
                    src={post.userId?.profilePic || "/default-profile.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover mr-3"
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
                <p className="text-gray-500">{post.content.slice(0, 100)}...</p>

                {/* ปุ่มแสดงความคิดเห็น พร้อมไอคอน */}
                <Link
                  to={`/community/post/${post._id}`}
                  className="flex items-center text-primary font-semibold mt-4"
                >
                  <MessageCircle className="w-5 h-5 mr-1" />
                  {post.comments.length} Comments
                </Link>
              </div>
            ))}
        </div>

         {/* If no courses found */}
         {filteredPosts.length === 0 && (
          <p className="text-center mt-4">There are no posts for this tag yet.</p>
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
