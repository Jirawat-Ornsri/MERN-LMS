import React from "react";

const QuizModal = ({
  selectedQuiz,
  answers,
  handleAnswerChange,
  handleSubmitQuiz,
  setSelectedQuiz,
  result,
}) => {
  if (!selectedQuiz) return null;

  const isCompleted = result && result.details && result.details.length > 0;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-base-300 p-6 rounded-lg w-full max-w-2xl md:w-3/4 lg:w-1/2">
        <h2 className="text-xl font-semibold text-center">{selectedQuiz.title}</h2>

        {/* แสดงผลลัพธ์หลังจากส่งคำตอบ */}
        {isCompleted && (
          <div className="mt-4 text-center p-3 bg-primary text-primary-content font-bold rounded">
            🏆 คุณได้ {result.score} / {result.total} คะแนน!
          </div>
        )}

        <div className="mt-4 space-y-4">
          {selectedQuiz.questions.map((q, index) => {
            const isCorrect = isCompleted ? result.details[index] === q.answer : null;
            const selectedAnswer = isCompleted ? result.details[index] : answers[q.question_id]; 

            return (
              <div key={q.question_id}>
                <p className="font-medium">{index + 1}. {q.question}</p>
                {q.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option; // ตรวจสอบว่าเลือกคำตอบนี้หรือไม่
                  const isAnswerCorrect = isCompleted && isSelected && isCorrect;
                  const isAnswerWrong = isCompleted && isSelected && !isCorrect;

                  return (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(q.question_id, option)}
                        disabled={isCompleted} // ล็อกคำตอบถ้าทำเสร็จแล้ว
                      />
                      <label
                        className={`px-2 py-1 rounded-lg 
                          ${isAnswerCorrect ? "bg-green-500 text-white" : ""} // คำตอบถูกต้องจะเป็นสีเขียว
                          ${isAnswerWrong ? "bg-red-500 text-white" : ""} // คำตอบผิดจะเป็นสีแดง
                          ${isSelected && !isAnswerCorrect && !isAnswerWrong ? "bg-indigo-900" : ""}`}> 
                          {option}
                      </label>
                    </div>
                  );
                })}
                {/* แสดงเฉลยถ้าผิด */}
                {isCompleted && !isCorrect && (
                  <div className="mt-2">
                    <p className="text-blue-500">✅ คำตอบที่ถูกต้อง: {q.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-between">
          <button
            onClick={() => setSelectedQuiz(null)}
            className="text-sm font-semibold bg-base-content text-base-300 px-4 py-2 rounded w-1/3 md:w-1/4"
          >
            Close
          </button>
          {!isCompleted && (
            <button
              onClick={handleSubmitQuiz}
              className="text-sm font-semibold bg-primary text-primary-content px-4 py-2 rounded w-1/3 md:w-1/4"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
