import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send } from "lucide-react"; 

const PostDetailPage = () => {
  const { postId } = useParams();
  const { selectedPost, fetchSinglePost, addComment } = usePostStore();
  const { authUser } = useAuthStore();
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchSinglePost(postId);
  }, [postId, fetchSinglePost]);

  const handleCommentSubmit = async () => {
    if (!authUser) {
      alert("You must be logged in to comment.");
      return;
    }

    if (comment.trim()) {
      await addComment(postId, { userId: authUser._id, comment });
      setComment("");
      fetchSinglePost(postId); 
    }
  };

  return (
    <div className="h-screen  p-6 mt-16">
      <div className="max-w-2xl mx-auto p-4 rounded-lg shadow">
        {selectedPost ? (
          <>
            {/* โชว์ข้อมูลเจ้าของโพสต์ */}
            <div className="flex items-center mb-4">
              <img
                src={selectedPost.userId?.profilePic || "/default-profile.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{selectedPost.userId?.fullName || "Unknown User"}</p>
                <p className="text-xs text-gray-500">
                  {new Date(selectedPost.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <h1 className="text-2xl font-bold">{selectedPost.title}</h1>
            <p className="mt-2">{selectedPost.content}</p>

            {/* แสดงคอมเมนต์ */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Comments</h3>
              <div className="mt-2 space-y-2">
                {selectedPost.comments?.length > 0 ? (
                  selectedPost.comments.map((c, index) => (
                    <div key={index} className="p-3 rounded flex items-start">
                      <img
                        src={c.userId?.profilePic || "/default-profile.png"}
                        alt="User"
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold">{c.userId?.fullName || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">
                          {c.timestamp
                            ? new Date(
                                typeof c.timestamp === "object" && c.timestamp.$date
                                  ? c.timestamp.$date.$numberLong || c.timestamp.$date
                                  : c.timestamp
                              ).toLocaleString()
                            : "Invalid Date"}
                        </p>
                        <p className="text-gray-500">{c.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>

              {/* ฟอร์มเพิ่มคอมเมนต์ */}
              {authUser ? (
                <div className="mt-4 flex items-center rounded-lg">
                  <input
                    type="text"
                    className="flex-1 p-2 rounded-lg border focus:outline-none"
                    placeholder="Comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    className="ml-2 bg-primary p-3 rounded-lg "
                    onClick={handleCommentSubmit}
                  >
                    <Send className="w-5 h-5 text-primary-content" />
                  </button>
                </div>
              ) : (
                <p className="text-red-500 mt-2">Login to add a comment.</p>
              )}
            </div>
          </>
        ) : (
          <p>Loading post...</p>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
