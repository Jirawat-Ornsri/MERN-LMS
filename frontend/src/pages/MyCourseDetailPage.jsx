import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEnrollStore } from "../store/useEnrollStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore"; // เพิ่มการดึง store
import Header from "../components/Header";

const MyCourseDetailPage = () => {
  const { enrollment_id } = useParams();
  const navigate = useNavigate();
  const { enrollments, getEnrollments } = useEnrollStore();
  const { authUser } = useAuthStore();
  const { completedVideos, completedQuizzes, fetchCourseStatus } = useUserStore(); // ดึงข้อมูลสถานะคอร์ส
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (enrollments.length === 0 && authUser?._id) {
        await getEnrollments(authUser._id);
      }
      const enrollment = enrollments.find((e) => e._id === enrollment_id);
      if (enrollment) {
        setCourse(enrollment);
        await fetchCourseStatus(enrollment.course_id._id, authUser._id); // ดึงข้อมูลสถานะคอร์ส
      }
      setLoading(false);
    };
  
    fetchEnrollment();
  }, [enrollment_id, enrollments, getEnrollments, authUser, fetchCourseStatus]);

  const calculateProgress = () => {
    if (!course?.course_id) return 0;
  
    let totalTasks = 0;
    let completedTasks = 0;
  
    course.course_id.lessons.forEach((lesson) => {
      totalTasks += lesson.videos.length;
      if (lesson.quiz) totalTasks += 1;

      lesson.videos.forEach((video) => {
        if (completedVideos.has(String(video.video_id))) {
          completedTasks += 1;
        }
      });

      if (lesson.quiz && completedQuizzes.has(String(lesson.quiz.quiz_id))) {
        completedTasks += 1;
      }
    });
  
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  };
  
  const progress = calculateProgress();

  const handleStartLearning = () => {
    navigate(`/watch-course/${enrollment_id}`);
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center text-red-500 text-lg">Course not found</div>;
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <Header text1={course.course_id?.title || "Course Title"} />

      <div className="max-w-4xl mx-auto text-center mb-12">
        <img
          src={course.course_id?.image || "default-image.jpg"}
          alt="Course Image"
          className="mx-auto mb-6 rounded-lg shadow-xl"
          style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "cover" }}
        />
        <h2 className="text-3xl font-bold text-gray-500 mb-2">{course.course_id?.title}</h2>
        <p className="text-gray-600 text-sm mb-4">{course.course_id?.description}</p>
        <p className="text-gray-500 text-md">Instructor: {course.course_id?.instructor}</p>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <h3 className="text-xl font-semibold text-gray-500">Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-gray-600 text-sm mt-1">{Math.round(progress)}% Completed</p>
      </div>

      <div className="max-w-4xl mx-auto mb-6">
        <button
          className="w-full py-3 px-6 bg-primary text-primary-content font-semibold rounded-lg shadow-md hover:bg-primary transition duration-300 ease-in-out"
          onClick={handleStartLearning}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default MyCourseDetailPage;
