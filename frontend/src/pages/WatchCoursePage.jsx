import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEnrollStore } from "../store/useEnrollStore";

const WatchCoursePage = () => {
  const { enrollment_id } = useParams(); // รับค่า enrollment_id จาก URL
  const { enrollments } = useEnrollStore(); // ดึงข้อมูล enrollments จาก store
  const [course, setCourse] = useState(null); // เก็บข้อมูล course
  const [selectedVideo, setSelectedVideo] = useState(null); // เก็บข้อมูลวิดีโอที่เลือก

  useEffect(() => {
    const fetchEnrollment = () => {
      // หาคอร์สจาก enrollment_id
      const enrollment = enrollments.find((e) => e._id === enrollment_id);

      // ถ้าเจอ enrollment ให้ตั้งค่า course และเลือกวิดีโอแรกจาก lessons
      if (enrollment) {
        setCourse(enrollment); // ตั้งค่า course
        if (enrollment.course_id?.lessons[0]?.videos) {
          setSelectedVideo(enrollment.course_id.lessons[0].videos[0]); // เลือกวิดีโอแรกจาก lessons
        }
      } else {
        console.log("Enrollment not found for id: ", enrollment_id);
      }
    };

    // ถ้า enrollments ว่างให้รีเฟรชข้อมูลจาก API (หรือ store)
    if (enrollments && enrollments.length > 0) {
      fetchEnrollment();
    } else {
      console.log("No enrollments found, need to fetch data.");
    }
  }, [enrollment_id, enrollments]); // รีเฟรชเมื่อ enrollment_id หรือ enrollments เปลี่ยน

  if (!course) {
    return <div>Loading...</div>;
  }

  const handleVideoSelect = (video) => {
    console.log("Selected Video: ", video); // ตรวจสอบว่ามีการเลือกวิดีโอใหม่
    setSelectedVideo(video); // ตั้งค่าวิดีโอที่เลือก
    console.log(selectedVideo.url);
  };



  return (
    <div className="h-screen py-16 max-w-7xl mx-auto grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h1 className="text-2xl font-semibold">{course.course_id?.title}</h1>

        {/* แสดงวิดีโอที่เลือก */}
        <div className="mt-6">
          {selectedVideo && (
            <div>
              <h3 className="text-xl font-medium mb-2">{selectedVideo.title}</h3>
              <video
                width="100%"
                height="auto"
                controls
                className="rounded-lg shadow-lg"
              >
                <source src={selectedVideo.url} />
                ขอโทษ, เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้.
              </video>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar สำหรับแสดงรายการวิดีโอ */}
      <div className="col-span-1 bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Videos</h3>
        <div className="space-y-4">
          {course.course_id?.lessons.map((lesson) => (
            <div key={lesson.lesson_id}>
              <h4 className="text-md font-semibold">{lesson.title}</h4>
              {lesson.videos.map((video) => (
                <div
                  key={video.video_id}
                  className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                  onClick={() => handleVideoSelect(video)} // เมื่อคลิกที่วิดีโอ ให้เลือกและแสดง
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
