// components/AutoTestAnswersModal.jsx
import React from "react";

const AutoTestAnswersModal = ({ test, onClose }) => {
  if (!test || !test.details) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full rounded shadow-lg overflow-y-auto max-h-[90vh] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">📖 Answers for: {test.chapter}</h2>
          <button onClick={onClose} className="text-red-500 font-bold text-xl">&times;</button>
        </div>

        <ul className="space-y-4">
          {test.details.map((item, idx) => (
            <li
              key={idx}
              className={`p-4 border rounded ${
                item.isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-semibold mb-1">
                Q{idx + 1}. {item.question}
              </p>
              <ul className="space-y-1">
                {item.options.map((opt, i) => {
                  const isUser = i === item.userAnswer;
                  const isCorrect = i === item.correctAnswer;

                  return (
                    <li
                      key={i}
                      className={`pl-2 flex items-center gap-1 ${
                        isCorrect
                          ? "text-green-700 font-semibold"
                          : isUser && !item.isCorrect
                          ? "text-red-700 font-extrabold"
                          : ""
                      }`}
                    >
                      {isCorrect ? "✔️" : isUser && !item.isCorrect ? "❌" : ""} {i + 1}. {opt}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AutoTestAnswersModal;
