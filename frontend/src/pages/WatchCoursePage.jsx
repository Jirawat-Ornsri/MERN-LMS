import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEnrollStore } from "../store/useEnrollStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

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
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
  const { getUserStatus, updateVideoStatus, updateQuizStatus } = useUserStore();

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (authUser?._id && enrollments.length === 0) {
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
    if (!isFetching && !course && authUser?._id) {
      fetchEnrollment();
    }
  }, [enrollment_id, enrollments, getEnrollments, authUser, isFetching, course]);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (authUser?._id && enrollment_id && course) {
        const data = await getUserStatus(authUser._id);
        if (data) {
          const currentCourseVideos = data.completedVideos.filter(item => item.courseId === course.course_id._id);
          const currentCourseQuizzes = data.completedQuizzes.filter(item => item.courseId === course.course_id._id);
          setCompletedVideos(new Set(currentCourseVideos.map(item => item.videoId)));
          setCompletedQuizzes(new Set(currentCourseQuizzes.map(item => item.quizId)));
        }
      }
    };
    fetchUserStatus();
  }, [authUser, enrollment_id, course]);

  const handleVideoSelect = (video, lesson) => {
    setSelectedVideo(video);
    setSelectedLesson(lesson);
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setResult(null);
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmitQuiz = async () => {
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
  
    if (!completedQuizzes.has(selectedQuiz.quiz_id)) {
      try {
        await updateQuizStatus(
          authUser._id, // userId
          selectedQuiz.quiz_id, // quizId
          course.course_id._id // courseId
        );
        
        setCompletedQuizzes(prev => new Set([...prev, selectedQuiz.quiz_id]));
  
        const data = await getUserStatus(authUser._id);
        if (data) {
          const currentCourseQuizzes = data.completedQuizzes.filter(item => item.courseId === course.course_id._id);
          setCompletedQuizzes(new Set(currentCourseQuizzes.map(item => item.quizId)));
        }
  
      } catch (error) {
        console.error("Error updating quiz status:", error);
        toast.error("Error updating quiz status");
      }
    } else {
      console.log("Quiz already completed, no update needed.");
    }
  };
  
  const handleVideoComplete = async (video) => {
    if (!completedVideos.has(video.video_id)) {
      try {
        await updateVideoStatus(
          authUser._id, // userId
          video.video_id, // videoId
          course.course_id._id // courseId
        );
        setCompletedVideos((prev) => new Set([...prev, video.video_id]));
        const data = await getUserStatus(authUser._id);
        if (data) {
          const currentCourseVideos = data.completedVideos.filter(item => item.courseId === course.course_id._id);
          setCompletedVideos(new Set(currentCourseVideos.map(item => item.videoId)));
        }
  
      } catch (error) {
        console.error("Error updating video status:", error);
        toast.error("Error updating video status");
      }
    }
  };
  
  if (isFetching || !course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen py-16 max-w-7xl mx-auto grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h1 className="text-2xl font-semibold">{course.course_id?.title}</h1>
        <div className="mt-6">
          {selectedVideo ? (
            <div>
              <h3 className="text-xl font-medium mb-2">{selectedVideo.title}</h3>
              <video
                key={selectedVideo.video_id}
                width="100%"
                height="auto"
                controls
                className="rounded-lg shadow-lg"
                onEnded={() => handleVideoComplete(selectedVideo)}
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

      <div className="col-span-1 p-4 rounded-lg shadow-md">
        <h3 className="text-4xl font-bold mb-4">Lessons</h3>
        <div className="space-y-4">
          {course.course_id?.lessons.map((lesson) => (
            <div key={lesson.lesson_id}>
              <h4 className="text-md font-semibold">{lesson.title}</h4>
              {lesson.videos.map((video) => (
                <div
                  key={video.video_id}
                  className={`cursor-pointer p-2 hover:bg-primary-content rounded ${selectedVideo?.video_id === video.video_id ? "bg-primary-content" : ""}`}
                  onClick={() => handleVideoSelect(video, lesson)}
                >
                  <p>
                    {completedVideos.has(String(video.video_id)) && "✅"} 🎬 {video.title}
                  </p>
                </div>
              ))}
              {lesson.quiz && (
                <div
                  className="cursor-pointer p-2 bg-yellow-100 hover:bg-yellow-200 rounded mt-2"
                  onClick={() => handleQuizSelect(lesson.quiz)}
                >
                  <p>
                    {completedQuizzes.has(String(lesson.quiz.quiz_id)) && "✅"} 📝 {lesson.quiz.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-semibold">{selectedQuiz.title}</h2>
            <div className="mt-4 space-y-4">
              {selectedQuiz.questions.map((q, index) => (
                <div key={q.question_id}>
                  <p className="font-medium">
                    {index + 1}. {q.question}
                  </p>
                  {q.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={option}
                        checked={answers[q.question_id] === option}
                        onChange={() => handleAnswerChange(q.question_id, option)}
                      />
                      <label>{option}</label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <button onClick={() => setSelectedQuiz(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Close
              </button>
              <button onClick={handleSubmitQuiz} className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit
              </button>
            </div>
            {result && (
              <div className="mt-4 p-4 border-t">
                <h3 className="font-bold">ผลลัพธ์: {result.score}/{result.total} ข้อถูกต้อง</h3>
                <ul className="mt-2 space-y-2">
                  {result.details.map((q) => (
                    <li key={q.question_id} className={q.isCorrect ? "text-green-600" : "text-red-600"}>
                      ✅ {q.isCorrect ? "ถูกต้อง" : "ผิด"} - {q.question}
                      {!q.isCorrect && <span className="ml-2 text-gray-600">(เฉลย: {q.answer})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchCoursePage;