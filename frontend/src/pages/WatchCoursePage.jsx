import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEnrollStore } from "../store/useEnrollStore";
import { useAuthStore } from "../store/useAuthStore";

const WatchCoursePage = () => {
  const { enrollment_id } = useParams(); // รับค่า enrollment_id จาก URL
  const { enrollments, getEnrollments, isFetching } = useEnrollStore(); // ดึงข้อมูล enrollments และสถานะการโหลดจาก store
  const [course, setCourse] = useState(null); // เก็บข้อมูล course
  const [selectedVideo, setSelectedVideo] = useState(null); // เก็บข้อมูลวิดีโอที่เลือก
  const { authUser } = useAuthStore(); // ข้อมูลผู้ใช้ที่ลงชื่อเข้าใช้

  useEffect(() => {
    // ฟังก์ชันนี้จะทำการดึงข้อมูล enrollment เมื่อ enrollments ว่าง
    const fetchEnrollment = async () => {
      if (enrollments.length === 0 && authUser?._id) {
        await getEnrollments(authUser._id); // ดึงข้อมูลการลงทะเบียนจาก store
      }
      const enrollment = enrollments.find((e) => e._id === enrollment_id); // ค้นหา enrollment ตาม enrollment_id

      if (enrollment) {
        setCourse(enrollment); // ตั้งค่า course
        if (enrollment.course_id?.lessons[0]?.videos) {
          setSelectedVideo(enrollment.course_id.lessons[0].videos[0]); // เลือกวิดีโอแรกจาก lessons
        }
      }
    };

    // ถ้า enrollments ยังไม่ได้รับการโหลด ก็ให้โหลดข้อมูลใหม่
    if (!isFetching && (enrollments.length === 0 || !course)) {
      fetchEnrollment();
    }

  }, [enrollment_id, enrollments, getEnrollments, authUser, isFetching]);  // รีเฟรชเมื่อ enrollment_id, enrollments, getEnrollments หรือ authUser เปลี่ยนแปลง

  // ตรวจสอบ selectedVideo เมื่อมันเปลี่ยน
  useEffect(() => {
    console.log("Selected video:", selectedVideo);
  }, [selectedVideo]);

  // ถ้ายังคงโหลดข้อมูลหรือยังไม่มี course
  if (isFetching || !course) {
    return <div>Loading...</div>;
  }

  // เมื่อคลิกที่วิดีโอใน Sidebar
  const handleVideoSelect = (video) => {
    // ตั้งค่าวิดีโอที่เลือก
    setSelectedVideo(video);
    console.log("Video selected:", video);
  };

  return (
    <div className="min-h-screen pt-32 pb-32 max-w-full mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
      <div className="col-span-1 sm:col-span-2">
        {/* แสดงวิดีโอที่เลือก */}
        <div>
          {selectedVideo ? (
            <div>
              <video
                key={selectedVideo.video_id} // ใช้ key เพื่อให้ React รีเรนเดอร์ใหม่เมื่อ selectedVideo เปลี่ยนแปลง
                width="100%"
                height="auto"
                controls
                className="rounded-lg shadow-lg"
              >
                <source src={selectedVideo.url} />
                ขอโทษ, เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้.
              </video>
            </div>
          ) : (
            <div>กรุณาเลือกวิดีโอเพื่อดู</div>
          )}
        </div>
      </div>

      {/* Sidebar สำหรับแสดงรายการวิดีโอ */}
      <div className="col-span-1 sm:col-span-1 p-4 rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold mb-4">{course.course_id?.title}</h1>
        <div className="space-y-4">
          {course.course_id?.lessons.map((lesson) => (
            <div key={lesson.lesson_id}>
              <h4 className="text-lg font-semibold">{lesson.title}</h4>
              {lesson.videos.map((video) => (
                <div
                  key={video.video_id}
                  className={`cursor-pointer p-2 hover:bg-gray-300 rounded ${selectedVideo?.video_id === video.video_id ? 'bg-gray-300' : ''}`} 
                  onClick={() => handleVideoSelect(video)} 
                >
                  <p>{video.title}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchCoursePage;
