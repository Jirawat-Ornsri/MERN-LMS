import { useParams, Link } from "react-router-dom";
import {
  Star,
  LibraryBig,
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
} from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";
import React, { useEffect } from "react";
import { useEnrollStore } from "../store/useEnrollStore";
import { useAuthStore } from "../store/useAuthStore";

const CourseDetailPage = () => {
  const { id } = useParams();
  const { getCourseById, course, isFetchingCourse } = useCourseStore();
  const { enrollCourse, getEnrollments, enrollments } = useEnrollStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (id) {
      getCourseById(id);
    }
  }, [id, getCourseById]);

  useEffect(() => {
    if (authUser?._id) {
      getEnrollments(authUser._id);
    }
  }, [authUser, getEnrollments]);

  if (isFetchingCourse) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
        <Link
          to="/"
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
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
          <div className="w-fit px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-3">
            {course.subject}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {course.title}
          </h1>
          <div className="flex items-center text-white">
            <div className="flex items-center mr-4">
              <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
              <span>4.8</span>
            </div>
            <div className="flex items-center">
              <LibraryBig className="h-4 w-4 mr-1" />
              <span>{course.lessons.length} lessons</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[80%] mx-auto pt-16 pb-32">
        <Link to="/courses" className="inline-flex items-center mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปยังหน้าคอร์สทั้งหมด
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-lg shadow-sm p-6 border">
              <h2 className="text-xl font-bold mb-4">รายละเอียดคอร์ส</h2>
              <p className="leading-relaxed">{course.description}</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">เนื้อหาครบถ้วน</h3>
                    <p className="text-sm">{course.lessons.length} บทเรียน</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">ระยะเวลา</h3>
                    <p className="text-sm">20 ชั่วโมง</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">อัพเดทล่าสุด</h3>
                    <p className="text-sm">มกราคม 2024</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-sm p-6 border">
              <h2 className="text-xl font-bold mb-4">ผู้สอน</h2>
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full border flex items-center justify-center text-xl font-bold mr-4">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{course.instructor}</h3>
                  <p className="text-sm">ผู้เชี่ยวชาญด้าน {course.subject}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow-sm p-6 border">
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
                    <span>{lesson.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="rounded-lg shadow-sm p-6 top-8 border">
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

              <div className="flex justify-between items-center pb-2 border-b">
                <span>ภาษา</span>
                <span className="font-medium">ไทย</span>
              </div>
              <div className="flex justify-between items-center">
                <span>การเข้าถึง</span>
                <span className="font-medium">ตลอดชีพ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
