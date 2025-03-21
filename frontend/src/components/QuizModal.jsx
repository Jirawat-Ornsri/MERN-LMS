import React from "react";

const QuizModal = ({ selectedQuiz, answers, handleAnswerChange, handleSubmitQuiz, setSelectedQuiz, result }) => {
  if (!selectedQuiz) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-primary-content p-6 rounded-lg w-full max-w-2xl md:w-3/4 lg:w-1/2">
        <h2 className="text-xl font-semibold text-primary text-center">{selectedQuiz.title}</h2>
        <div className="mt-4 space-y-4">
          {selectedQuiz.questions.map((q, index) => (
            <div key={q.question_id}>
              <p className="font-medium text-primary">{index + 1}. {q.question}</p>
              {q.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-primary">
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
          <button onClick={() => setSelectedQuiz(null)} className="bg-gray-500 text-white px-4 py-2 rounded w-1/3 md:w-1/4">Close</button>
          <button onClick={handleSubmitQuiz} className="bg-primary text-primary-content px-4 py-2 rounded w-1/3 md:w-1/4">Submit</button>
        </div>

        {result && (
          <div className="mt-4 p-4 border-t">
            <h3 className="font-bold text-primary text-center">ผลลัพธ์: {result.score}/{result.total} ข้อถูกต้อง</h3>
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
  );
};

export default QuizModal;
