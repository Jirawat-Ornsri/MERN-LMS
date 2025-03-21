import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEnrollStore } from "../store/useEnrollStore";
import { useAuthStore } from "../store/useAuthStore";
import { MonitorPlay, Star } from 'lucide-react'


const MyCourseDetailPage = () => {
  const { enrollment_id } = useParams();
  const navigate = useNavigate();
  const { enrollments, getEnrollments } = useEnrollStore();
  const { authUser } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (enrollments.length === 0 && authUser?._id) {
        await getEnrollments(authUser._id);
      }
      const enrollment = enrollments.find((e) => e._id === enrollment_id);
      if (enrollment) {
        setCourse(enrollment);
      }
      setLoading(false);
    };

    fetchEnrollment();
  }, [enrollment_id, enrollments, getEnrollments, authUser]);

  if (loading) {
    return <div className="text-center text-gray-500 py-10">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center text-red-500 text-lg py-10">Enrollment not found</div>;
  }

  // คำนวณ % ความคืบหน้า
  const calculateProgress = () => {
    if (!course.progress || course.progress.length === 0) {
      return 0;
    }
    const completedLessons = course.progress.filter((lesson) => lesson.completed).length;
    return (completedLessons / course.course_id.lessons.length) * 100;
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen mt-16 py-14 flex justify-center px-4">
      <div className="max-w-4xl w-full bg-base-300 p-6 rounded-lg shadow-lg">
        {/* Course Image */}
        <img
          src={course.course_id?.image || "default-image.jpg"}
          alt="Course Thumbnail"
          className="w-full h-64 object-cover rounded-lg"
        />

        {/* Course Title */}
        <h1 className="text-3xl font-bold mt-6">{course.course_id?.title}</h1>
        <p className="text-gray-500 text-sm mt-1">By {course.course_id?.instructor}</p>

        {/* Categories */}
        <div className="mt-3 flex flex-wrap gap-2">
          {course.course_id?.category.map((cat, index) => (
            <span key={index} className="bg-accent text-base-100 text-xs px-3 py-1 rounded-full">
              {cat}
            </span>
          ))}
        </div>

        {/* Enrollment Dates */}
        <p className="text-gray-500 text-sm mt-3">
          <strong>Enrolled At:</strong> {new Date(course.enrolled_at).toLocaleDateString()}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Created At:</strong> {new Date(course.createdAt).toLocaleDateString()}
        </p>

        {/* Progress Bar */}
        <div className="mt-4">
          <h3 className="text-lg font-bold">Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div className="bg-secondary h-3 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-gray-600 text-sm mt-1">{Math.round(progress)}% Completed</p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => navigate(`/watch-course/${enrollment_id}`)}
            className="bg-primary font-semibold text-primary-content px-6 py-2 rounded-lg flex items-center gap-2 shadow-md "
          >
           
            Play <MonitorPlay className="w-5 h-5"/>
          </button>

          <button
            className="bg-base-100 font-semibold text-primary px-6 py-2 rounded-lg flex items-center gap-2 shadow-md"
          >
            
            Review <Star className="w-5 h-5"/>
          </button>
        </div>

        {/* Tabs Section */}
        <div className="mt-6">
          <div className="flex border-b-">
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "description" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "lessons" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
              onClick={() => setActiveTab("lessons")}
            >
              Lessons
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "description" && (
              <p className="text-gray-600">{course.course_id?.description}</p>
            )}
            {activeTab === "lessons" && (
              <ul className="list-disc pl-6 text-gray-600">
                {course.course_id?.lessons.map((lesson, index) => (
                  <li key={index}>{lesson.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetailPage;
