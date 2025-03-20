import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEnrollStore } from "../store/useEnrollStore";
import { useAuthStore } from "../store/useAuthStore";

const WatchCoursePage = () => {
  const { enrollment_id } = useParams();
  const { enrollments, getEnrollments, isFetching } = useEnrollStore();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const { authUser } = useAuthStore();

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (enrollments.length === 0 && authUser?._id) {
        await getEnrollments(authUser._id);
      }
      const enrollment = enrollments.find((e) => e._id === enrollment_id);
      if (enrollment) {
        setCourse(enrollment);
        if (enrollment.course_id?.lessons[0]?.videos) {
          setSelectedVideo(enrollment.course_id.lessons[0].videos[0]);
          setSelectedLesson(enrollment.course_id.lessons[0]);
        }
      }
    };

    if (!isFetching && (enrollments.length === 0 || !course)) {
      fetchEnrollment();
    }
  }, [enrollment_id, enrollments, getEnrollments, authUser, isFetching]);

  if (isFetching || !course) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="py-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-semibold">{course.course_id?.title}</h1>
        <div className="mt-6">
          {selectedVideo ? (
            <div>
              <h3 className="text-xl font-medium mb-2">{selectedVideo.title}</h3>
              <video key={selectedVideo.video_id} className="w-full rounded-lg shadow-lg" controls>
                <source src={selectedVideo.url} />
                ขอโทษ, เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้.
              </video>
            </div>
          ) : (
            <div>กรุณาเลือกวิดีโอเพื่อดู</div>
          )}
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">Lessons</h3>
        <div className="space-y-4">
          {course.course_id?.lessons.map((lesson) => (
            <div key={lesson.lesson_id}>
              <h4 className="text-md font-semibold">{lesson.title}</h4>
              {lesson.videos.map((video) => (
                <div
                  key={video.video_id}
                  className={`cursor-pointer p-2 hover:bg-primary-content rounded ${selectedVideo?.video_id === video.video_id ? "bg-primary-content" : ""}`}
                  onClick={() => setSelectedVideo(video)}
                >
                  🎬 {video.title}
                </div>
              ))}
              {lesson.quiz && (
                <div
                  className="cursor-pointer p-2 bg-yellow-100 hover:bg-yellow-200 rounded mt-2"
                  onClick={() => setSelectedQuiz(lesson.quiz)}
                >
                  📝 {lesson.quiz.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchCoursePage;
