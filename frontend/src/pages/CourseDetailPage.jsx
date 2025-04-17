import { useParams, Link } from "react-router-dom";
import {
  Star,
  LibraryBig,
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
  Loader,
  BookA 
} from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";
import { useReviewStore } from "../store/useReviewStore";
import React, { useEffect, useState } from "react";
import { useEnrollStore } from "../store/useEnrollStore";
import { useAuthStore } from "../store/useAuthStore";

const CourseDetailPage = () => {
  const { id } = useParams();
  const { getCourseById, course, isFetchingCourse } = useCourseStore();
  const { enrollCourse, getEnrollments, enrollments } = useEnrollStore();
  const { fetchReviewsByCourse, selectedReviews } = useReviewStore();
  const { authUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState("details");
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (id) {
      getCourseById(id);
      fetchReviewsByCourse(id);
    }
  }, [id, getCourseById, fetchReviewsByCourse]);

  useEffect(() => {
    if (authUser?._id) {
      getEnrollments(authUser._id);
    }
  }, [authUser, getEnrollments]);


  if (isFetchingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold ">Course not found</h2>
        <Link to="/" className="mt-4 flex items-center text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>
      </div>
    );
  }

  const isEnrolled = enrollments?.some(
    (enrollment) => enrollment.course_id._id === id
  );

  const handleEnroll = async () => {
    if (authUser?._id) {
      await enrollCourse(authUser._id, id);
      getEnrollments(authUser._id); // ดึงข้อมูลใหม่หลังลงทะเบียน
    }
  };

  const calculateAverageRating = () => {
    if (!selectedReviews || selectedReviews.length === 0) return 0;
    const totalRating = selectedReviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / selectedReviews.length).toFixed(1); // คำนวณค่าเฉลี่ยและเก็บทศนิยม 1 ตำแหน่ง
  };
  

  return (
    <div className="min-h-screen">
      <div className="relative h-80 md:h-96 w-full">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10">
          <div className="w-fit px-3 py-1 bg-accent text-base-100 text-sm font-medium rounded-full mb-3">
            {course.subject}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {course.title}
          </h1>
          <div className="flex items-center text-white">
            <div className="flex items-center mr-4">
              <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
              <span>{calculateAverageRating()}</span>
            </div>
            <div className="flex items-center mr-4">
              <LibraryBig className="h-4 w-4 text-green-600 mr-1" />
              <span>{course.lessons.length} lessons</span>
            </div>
            <div className="flex items-center">
              <BookA className="h-4 w-4 text-orange-400 mr-1" />
              <span>{course.level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[80%] mx-auto pt-16 pb-32">
        <Link to="/courses" className="inline-flex items-center mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปยังหน้าคอร์สทั้งหมด
        </Link>

        {/* Tabs */}
        <div className="flex space-x-6 mb-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`font-semibold pb-2 border-b-2 ${
              activeTab === "details"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500"
            }`}
          >
            Course Detail
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`font-semibold pb-2 border-b-2 ${
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500"
            }`}
          >
            Review ({selectedReviews?.length || 0})
          </button>
        </div>

        {/* Course Detail Tab */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="rounded-lg shadow-sm p-6 bg-base-300 text-base-content">
                <h2 className="text-xl font-bold mb-4">รายละเอียดคอร์ส</h2>
                <p className="leading-relaxed text-gray-600">
                  {course.description}
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">เนื้อหาครบถ้วน</h3>
                      <p className="text-sm text-gray-600">
                        {course.lessons.length} บทเรียน
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">ระยะเวลา</h3>
                      <p className="text-sm text-gray-600">20 ชั่วโมง</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">อัพเดทล่าสุด</h3>
                      <p className="text-sm text-gray-600">มกราคม 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg shadow-sm p-6 bg-base-300 text-base-content">
                <h2 className="text-xl font-bold mb-4">ผู้สอน</h2>
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full border flex items-center justify-center text-xl font-bold mr-4">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{course.instructor}</h3>
                    <p className="text-sm text-gray-600">
                      ผู้เชี่ยวชาญด้าน {course.subject}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg shadow-sm p-6 bg-base-300 text-base-content">
                <h2 className="text-xl font-bold mb-4">
                  สิ่งที่คุณจะได้เรียนรู้
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.lessons.map((lesson) => (
                    <li key={lesson.lesson_id} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600">{lesson.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="rounded-lg shadow-sm p-6 top-8 bg-base-300 text-base-content">
                <div className="text-3xl font-bold mb-4">Free</div>

                {isEnrolled ? (
                  <button
                    className="btn btn-secondary w-full font-medium py-3 px-4 rounded-lg transition-colors mb-4"
                    disabled
                  >
                    ลงทะเบียนแล้ว
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="btn btn-primary w-full font-medium py-3 px-4 rounded-lg transition-colors mb-4"
                  >
                    ลงทะเบียนเรียน
                  </button>
                )}

                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">ภาษา</span>
                  <span className="font-medium text-gray-600">ไทย</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">การเข้าถึง</span>
                  <span className="font-medium text-gray-600">ตลอดชีพ</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Level</span>
                  <span className="font-medium text-gray-600">{course.level}</span>
                </div>
              </div>
            </div>
          </div>
        )}

   
        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="bg-base-300 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Reviews from students</h2>

            {selectedReviews.length === 0 ? (
              <p className="text-gray-500">This course has no reviews yet.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {selectedReviews
                    ?.slice(0, showAllReviews ? selectedReviews.length : 5)
                    .map((review) => {                

                      return (
                        <div
                          key={review._id}
                          className="rounded-lg shadow p-4 bg-base-100"
                        >
                          {/* Show Reviewer's profile and name */}
                          <div className="flex items-center space-x-4 mb-3">
                            <img
                              src={review.userId.profilePic} // If no profile, show placeholder                         
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {review.userId.fullName}
                              </h3>
                              <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Rating Stars */}
                          <div className="flex items-center space-x-2">
                            {Array.from({ length: 5 }, (_, index) => (
                              <Star
                                key={index}
                                className={`w-4 h-4 ${
                                  index < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-400 fill-gray-400"
                                }`}
                              />
                            ))}
                          </div>

                          {/* Review title and content */}
                          <h3 className="font-semibold mt-2">{review.title}</h3>
                          <p className="text-gray-600 mt-1">{review.content}</p>
                        </div>
                      );
                    })}
                </div>

                {selectedReviews.length > 5 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-primary font-medium mt-4 block"
                  >
                    {showAllReviews ? "Show less" : "Show more"}
                  </button>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseDetailPage;
