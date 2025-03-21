import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEnrollStore } from "../store/useEnrollStore";
import { useAuthStore } from "../store/useAuthStore";
import QuizModal from "../components/QuizModal";

const WatchCoursePage = () => {
  const { enrollment_id } = useParams();
  const { enrollments, getEnrollments, isFetching } = useEnrollStore();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // ✅ เก็บคำตอบที่เลือก
  const [result, setResult] = useState(null); // ✅ เก็บผลลัพธ์ของ Quiz
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
    return <div>Loading...</div>;
  }

  const handleVideoSelect = (video, lesson) => {
    setSelectedVideo(video);
    setSelectedLesson(lesson);
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({}); // รีเซ็ตคำตอบทุกครั้งที่เปิด Quiz
    setResult(null); // รีเซ็ตผลลัพธ์
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmitQuiz = () => {
    const unanswered = selectedQuiz.questions.some((q) => !answers[q.question_id]);
    if (unanswered) {
      alert("กรุณาตอบทุกข้อก่อนส่งคำตอบ!");
      return;
    }

    let correctCount = 0;
    const results = selectedQuiz.questions.map((q) => {
      const isCorrect = answers[q.question_id] === q.answer;
      if (isCorrect) correctCount++;
      return { ...q, selectedAnswer: answers[q.question_id], isCorrect };
    });

    setResult({ score: correctCount, total: selectedQuiz.questions.length, details: results });
  };

  return (
    <div className="min-h-screen pt-32 pb-16 max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
      {/* --- video section --- */}
      <div className="md:col-span-2">       
        <div>
          {selectedVideo ? (
            <div>            
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
      
      {/* --- side bar --- */}
      <div className="p-4 rounded-lg shadow-2xl bg-base-300 text-base-content">
        <h1 className="text-2xl font-bold mb-6">{course.course_id?.title}</h1>
        <div className="space-y-4">
          {course.course_id?.lessons.map((lesson) => (
            <div key={lesson.lesson_id}>
              <h4 className="text-md font-semibold">{lesson.title}</h4>

              {lesson.videos.map((video) => (
                <div key={video.video_id} className={`cursor-pointer p-2 hover:bg-secondary rounded ${selectedVideo?.video_id === video.video_id ? "bg-secondary" : ""}`} onClick={() => handleVideoSelect(video, lesson)}>
                  <p className="text-base">🎬 {video.title}</p>
                </div>
              ))}

              {lesson.quiz && (
                <div
                  className="text-base cursor-pointer p-2 hover:bg-secondary rounded mt-2"
                  onClick={() => handleQuizSelect(lesson.quiz)}
                >
                  📝 {lesson.quiz.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Quiz Modal */}
      {selectedQuiz && (
        <QuizModal 
          selectedQuiz={selectedQuiz} 
          answers={answers} 
          handleAnswerChange={handleAnswerChange} 
          handleSubmitQuiz={handleSubmitQuiz} 
          setSelectedQuiz={setSelectedQuiz} 
          result={result} 
        />
      )}
    </div>
  );
};

export default WatchCoursePage;
