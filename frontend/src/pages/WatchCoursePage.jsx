import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEnrollStore } from "../store/useEnrollStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import QuizModal from "../components/QuizModal";
import PartyEffect from "../components/PartyEffect";
import toast from "react-hot-toast";
import { Loader, Download } from "lucide-react";

const WatchCoursePage = () => {
  const { enrollment_id } = useParams();
  const { enrollments, getEnrollments, isFetching } = useEnrollStore();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
  const { authUser } = useAuthStore();
  const {
    getUserStatus,
    updateVideoStatus,
    getQuizResult,
    saveQuizResult,
    getContinueWatching,
    continueWatching,
  } = useUserStore();
  const isPartyActive = useUserStore((state) => state.isPartyActive);
  const hasSavedResult = useRef(false);
  const [lastWatchedTime, setLastWatchedTime] = useState(0);
  const shouldSetTime = useRef(false);
  const videoRef = useRef(null); // ✅ อยู่ก่อน useEffect ที่ใช้มัน

  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!authUser?._id || isFetching || course) return;
      await getEnrollments(authUser._id);
      const enrollment = enrollments.find((e) => e._id === enrollment_id);
      if (enrollment) {
        setCourse(enrollment);
      }
    };
    fetchEnrollment();
  }, [authUser, enrollment_id, enrollments, isFetching, course]);
  
  useEffect(() => {
    const fetchContinueWatching = async () => {
      if (!course || !authUser?._id) return;
    
      const continueData = await getContinueWatching(
        authUser._id,
        course.course_id._id
      );
      const allVideos = course.course_id.lessons.flatMap(
        (lesson) => lesson.videos
      );
    
      // 🔧 หาตัวที่ตรงกับ course_id ปัจจุบัน
      const entry = continueData.continueWatching?.find(
        (item) => String(item.course_id) === String(course.course_id._id)
      );
    
      const lastVideo = allVideos.find(
        (v) => String(v.video_id) === String(entry?.video_id)
      );
    
      if (lastVideo) {
        setLastWatchedTime(entry.lastWatchedTime || 0);
        shouldSetTime.current = true;
        setSelectedVideo(lastVideo);
      } else {
        setLastWatchedTime(0);
        shouldSetTime.current = false;
        setSelectedVideo(course.course_id.lessons[0]?.videos[0]);
      }
    };
    
  
    fetchContinueWatching();
  }, [course, authUser]);
  
  useEffect(() => {
    const fetchUserStatusAndQuiz = async () => {
      if (!authUser?._id || !course) return;
      const data = await getUserStatus(authUser._id);
      if (data) {
        const completedVideosSet = new Set();
        data.completedVideos.forEach((item) => {
          if (String(item.courseId) === String(course.course_id._id)) {
            completedVideosSet.add(String(item.videoId));
          }
        });
        setCompletedVideos(completedVideosSet);
  
        const completedQuizResults = new Set();
        for (let lesson of course.course_id.lessons) {
          if (lesson.quiz) {
            const quizResult = await getQuizResult(
              authUser._id,
              lesson.quiz.quiz_id,
              course.course_id._id
            );
            if (quizResult && quizResult.quizResult) {
              completedQuizResults.add(lesson.quiz.quiz_id);
              if (!result && !completedQuizzes.has(lesson.quiz.quiz_id)) {
                setResult({
                  score: quizResult.quizResult.score,
                  total: quizResult.quizResult.totalQuestions,
                  details: quizResult.quizResult.answers,
                });
              }
            }
          }
        }
        setCompletedQuizzes(completedQuizResults);
      }
    };
  
    fetchUserStatusAndQuiz();
  }, [authUser, course, result, completedQuizzes]);
  
  useEffect(() => {
    if (selectedVideo && lastWatchedTime > 0) {
      shouldSetTime.current = true;
    }
  }, [selectedVideo, lastWatchedTime]); // ขึ้นกับ selectedVideo และ lastWatchedTime

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && authUser && course && selectedVideo) {
        const currentTime = videoRef.current.currentTime;

        if (currentTime > 0) {
          continueWatching(
            authUser._id,
            course.course_id._id,
            selectedVideo.video_id,
            currentTime
          );
        }
      }
    }, 5000); // บันทึกทุก 5 วินาที

    return () => clearInterval(interval); // ล้าง interval เมื่อคอมโพเนนต์ถูกทำลาย
  }, [selectedVideo, authUser, course]);

  const handleVideoSelect = async (video) => {
    shouldSetTime.current = true; // Set to true when selecting a new video
    setSelectedVideo(video);

    const continueData = await getContinueWatching(authUser._id, course.course_id._id);
    const videoData = continueData?.continueWatching?.find(
      (entry) =>
        String(entry.video_id) === String(video.video_id) &&
        String(entry.course_id) === String(course.course_id._id)
    );
    if (videoData) {
      if (videoData.video_id !== selectedVideo?.video_id) {
        setLastWatchedTime(videoData.lastWatchedTime); // Set lastWatchedTime
      }
    } else {
      setLastWatchedTime(0);
    }
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleQuizSelect = async (quiz) => {
    if (!quiz) return;
    setSelectedQuiz(quiz);

    try {
      if (completedQuizzes.has(quiz.quiz_id)) return;
      const response = await getQuizResult(
        authUser._id,
        quiz.quiz_id,
        course.course_id._id
      );
      if (response?.quizResult) {
        setResult({
          score: response.quizResult.score,
          total: response.quizResult.totalQuestions,
          details: response.quizResult.answers,
        });
      }
    } catch (error) {}
  };

  const handleSubmitQuiz = async () => {
    if (selectedQuiz.questions.some((q) => !answers[q.question_id])) {
      toast("Please answer all questions before submitting!", {
        icon: "⚠️",
      });
      return;
    }

    let correctCount = 0;
    const results = selectedQuiz.questions.map((q) => {
      const isCorrect = answers[q.question_id] === q.answer;
      if (isCorrect) correctCount++;
      return {
        ...q,
        selectedAnswer: answers[q.question_id],
        isCorrect,
      };
    });

    setResult({
      score: correctCount,
      total: selectedQuiz.questions.length,
      details: results,
    });
  };

  useEffect(() => {
    if (!selectedQuiz || !result?.details || hasSavedResult.current) return;
    if (completedQuizzes.has(selectedQuiz.quiz_id)) return;

    saveQuizResult(
      authUser._id,
      course.course_id._id,
      selectedQuiz.quiz_id,
      result.details,
      selectedQuiz.questions?.length || 0,
      result.score
    );
    hasSavedResult.current = true;
  }, [result, selectedQuiz, completedQuizzes]);

  const handleVideoComplete = async (video) => {
    if (!completedVideos.has(video.video_id)) {
      try {
        await updateVideoStatus(
          authUser._id,
          video.video_id,
          course.course_id._id
        );
        setCompletedVideos((prev) => new Set(prev.add(video.video_id)));
      } catch (error) {
        console.error("Error updating video status:", error);
        toast.error("Error updating video status");
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
  
    if (
      video &&
      shouldSetTime.current &&
      lastWatchedTime > 0 &&
      video.readyState >= 1 // video loaded metadata แล้ว
    ) {
      video.currentTime = lastWatchedTime;
      shouldSetTime.current = false;
    }
  }, [selectedVideo, lastWatchedTime]);
  const handleDownloadVideo = (videoUrl, videoTitle) => {
    try {
      // สร้าง anchor tag สำหรับดาวน์โหลด
      const link = document.createElement("a");
  
      // ตรวจสอบว่า videoUrl ถูกต้อง
      if (!videoUrl) {
        console.error("URL ของวิดีโอไม่ถูกต้อง");
        return;
      }
  
      // เพิ่ม fl_attachment ใน URL เพื่อให้ดาวน์โหลดอัตโนมัติ
      const downloadUrl = `${videoUrl.replace('/video/upload/', '/video/upload/fl_attachment/')}`;
  
      // ตั้งค่า href เป็น URL ของวิดีโอที่ต้องการดาวน์โหลด
      link.href = downloadUrl;
  
      // คลิกที่ link เพื่อดาวน์โหลดไฟล์
      link.click();

    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดาวน์โหลด:", error);
    }
  };
  
  

  if (isFetching || !course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 max-w-[90%] mx-auto flex flex-col lg:flex-row gap-5">
      {/* --- video section --- */}
      <div className="w-full lg:w-[90%]">
        <div>
          {selectedVideo ? (
            <div>
              <video
                ref={videoRef}
                key={selectedVideo.video_id}
                width="100%"
                height="auto"
                controls
                className="rounded-lg shadow-lg"
                onEnded={() => handleVideoComplete(selectedVideo)}
                onLoadedMetadata={() => {
                  if (shouldSetTime.current && lastWatchedTime > 0) {
                    videoRef.current.currentTime = lastWatchedTime;
                    shouldSetTime.current = false;
                  }
                }}
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

      <div className="p-4 rounded-lg shadow-2xl bg-base-300 text-base-content">
        <h1 className="text-2xl font-bold mb-6">{course.course_id?.title}</h1>
        <div className="space-y-4">
          {course.course_id?.lessons.map((lesson) => (
            <div key={lesson.lesson_id}>
              <h4 className="text-md font-semibold">{lesson.title}</h4>
              {lesson.videos.map((video) => (
                <div
                  key={video.video_id}
                  className={`cursor-pointer p-2 hover:bg-base-100 rounded ${
                    selectedVideo?.video_id === video.video_id
                      ? "bg-base-100"
                      : ""
                  }`}
                  onClick={() => handleVideoSelect(video, lesson)}
                >
                  <div className="flex items-center justify-between">
                    <p>
                      {completedVideos.has(String(video.video_id)) && "✅"} 🎬{" "}
                      {video.title}
                    </p>
                    {selectedVideo?.video_id === video.video_id && (
                      <Download
                        className="w-5 h-5 text-primary"
                        onClick={() =>
                          handleDownloadVideo(video.url, video.title)
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
              {lesson.quiz && (
                <div
                  className="text-base cursor-pointer p-2 hover:bg-base-100 rounded mt-2"
                  onClick={() => handleQuizSelect(lesson.quiz)}
                >
                  <p>
                    {completedQuizzes.has(String(lesson.quiz.quiz_id)) && "✅"}{" "}
                    📝 {lesson.quiz.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

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

      {isPartyActive && <PartyEffect />}
    </div>
  );
};

export default WatchCoursePage;
