

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../utils/axios";
// import Header from "../components/Header";

// const TestPage = () => {
//   const { subject, chapterId } = useParams();
//   const navigate = useNavigate();

//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [score, setScore] = useState(null);
//   const [total, setTotal] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [message, setMessage] = useState("");
//   const [detailedResults, setDetailedResults] = useState([]);

//   // const fetchQuestions = async () => {
//   //   try {
//   //     const res = await api.get(`/questions/${subject}/${chapterId}`);
//   //     setQuestions(res.data);
//   //     setAnswers(new Array(res.data.length).fill(null));
//   //   } catch (err) {
//   //     console.error("Failed to fetch questions:", err);
//   //   }
//   // };

//   // In TestPage.jsx's fetchQuestions()
// const fetchQuestions = async () => {
//   try {
//     const res = await api.get(`/questions/${subject}/${chapterId}`);
    
//     if (res.data.message === 'No questions found') {
//       // Show user-friendly message with backend's diagnostic data
//       setErrorState(
//         `No questions available for: 
//         ${res.data.attemptedMatches.decodedChapter || chapterId}
//         Available chapters: ${res.data.availableChapters?.join(', ') || 'none'}`
//       );
//       return;
//     }
    
//     setQuestions(res.data);
//   } catch (err) {
//     console.error("Fetch error:", err.response?.data || err.message);
//     setErrorState(
//       err.response?.data?.diagnostic || 
//       "Failed to load questions. Please try another chapter."
//     );
//   }
// };

//   useEffect(() => {
//     fetchQuestions();
//   }, [subject, chapterId]);

//   const handleChange = (questionIndex, optionIndex) => {
//     const updatedAnswers = [...answers];
//     updatedAnswers[questionIndex] = optionIndex;
//     setAnswers(updatedAnswers);
//   };

//   const handleSubmit = async () => {
//   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//   if (!token) return navigate("/enroll");

//   try {
//     const res = await api.post(
//       "/tests/submit",
//       { subject, chapter: chapterId, answers },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const { score, total, detailedResults } = res.data;
//     setScore(score);
//     setTotal(total);
//     setDetailedResults(detailedResults);
//     setSubmitted(true);

//     // Save result to backend
//     await api.post(
//       "/results/save",
//       {
//         subject,
//         chapter: chapterId,
//         score,
//         total,
//         detailedResults,
//         type: "chapter", // or "manual", "mock" etc. if needed
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//   } catch (err) {
//     console.error("Submit error:", err);
//     setMessage("❌ Failed to submit test");
//   }
// };


//   return (
//     <div>
//       <Header />
//       <main className="max-w-3xl mx-auto px-4 py-6">
//         <h2 className="text-2xl font-bold mb-4 text-center">{chapterId} - {subject} Test</h2>

//         {!submitted ? (
//           <>
//             {questions.map((q, i) => (
//               <div key={i} className="mb-6 border p-4 rounded shadow bg-white">
//                 <p className="font-semibold mb-2">
//                   Q{i + 1}. {q.question}
//                 </p>
//                 <div className="space-y-2">
//                   {q.options.map((opt, idx) => (
//                     <label key={idx} className="block">
//                       <input
//                         type="radio"
//                         name={`question-${i}`}
//                         value={idx}
//                         checked={answers[i] === idx}
//                         onChange={() => handleChange(i, idx)}
//                         className="mr-2"
//                       />
//                       {opt}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             <button
//               onClick={handleSubmit}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
//             >
//               Submit Test
//             </button>

//             {message && (
//               <p className="mt-4 text-red-600 text-center">{message}</p>
//             )}
//           </>
//         ) : (
//           <div className="mt-8">
//             <h3 className="text-xl font-bold mb-4 text-green-700 text-center">
//               ✅ Test Submitted - Score: {score} / {total}
//             </h3>
//            <ul className="space-y-4">
//   {detailedResults.map((result, idx) => (
//     <li
//       key={idx}
//       className={`p-4 rounded border ${
//         result.isCorrect ? "bg-green-100" : "bg-red-100"
//       }`}
//     >
//       <p className="font-semibold mb-2">
//         Q{idx + 1}. {result.question}
//       </p>
//       <ul className="space-y-1">
//         {result.options.map((opt, i) => {
//           const isCorrect = i === result.correctAnswer;
//           const isWrong = i === result.userAnswer && !result.isCorrect;

//           return (
//             <li
//               key={i}
//               className={`pl-2 flex items-center gap-2 ${
//                 isCorrect
//                   ? "text-green-700 font-semibold"
//                   : isWrong
//                   ? "text-red-700 font-semibold "
//                   : ""
//               }`}
//             >
//               {isCorrect && <span>✅</span>}
//               {isWrong && <span>❌</span>}
//               <span>{i + 1}. {opt}</span>
//             </li>
//           );
//         })}
//       </ul>
//     </li>
//   ))}
// </ul>

//           </div>
//         )}
//       </main>
//       {/* <footer className="bg-gray-800 text-white text-center p-4">
//         <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
//       </footer> */}
//     </div>
//   );
// };

// export default TestPage;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import Header from "../components/Header";

const TestPage = () => {
  const { subject, chapterId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [total, setTotal] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [detailedResults, setDetailedResults] = useState([]);
  const [errorState, setErrorState] = useState("");

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/questions/${subject}/${chapterId}`);

      if (res.data.message === "No questions found") {
        setErrorState(
          `No questions available for: ${
            res.data.attemptedMatches?.decodedChapter || chapterId
          }\nAvailable chapters: ${
            res.data.availableChapters?.join(", ") || "none"
          }`
        );
        return;
      }

      setQuestions(res.data);
      setAnswers(new Array(res.data.length).fill(null));
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setErrorState(
        err.response?.data?.diagnostic ||
          "Failed to load questions. Please try another chapter."
      );
    }
  };

  useEffect(() => {
    // Load result from localStorage if present
    const savedResult = localStorage.getItem(
      `testResult-${subject}-${chapterId}`
    );
    if (savedResult) {
      const parsed = JSON.parse(savedResult);
      setScore(parsed.score);
      setTotal(parsed.total);
      setDetailedResults(parsed.detailedResults);
      setSubmitted(true);
    } else {
      fetchQuestions();
    }
  }, [subject, chapterId]);

  const handleChange = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return navigate("/enroll");

    try {
      const res = await api.post(
        "/tests/submit",
        { subject, chapter: chapterId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { score, total, detailedResults } = res.data;
      setScore(score);
      setTotal(total);
      setDetailedResults(detailedResults);
      setSubmitted(true);

      // Save result locally
      localStorage.setItem(
        `testResult-${subject}-${chapterId}`,
        JSON.stringify({ score, total, detailedResults })
      );

      // Save result to DB
      await api.post(
        "/results/save",
        {
          subject,
          chapter: chapterId,
          score,
          total,
          detailedResults,
          type: "chapter",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Failed to submit test");
    }
  };

  return (
    <div>
      <Header hideHeader={true} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* ✅ Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {chapterId} - {subject} Test
        </h2>

        {errorState && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded mb-4">
            {errorState}
          </div>
        )}

        {!submitted ? (
          <>
            {questions.map((q, i) => (
              <div key={i} className="mb-6 border p-4 rounded shadow bg-white">
                <p className="font-semibold mb-2">
                  Q{i + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, idx) => (
                    <label key={idx} className="block">
                      <input
                        type="radio"
                        name={`question-${i}`}
                        value={idx}
                        checked={answers[i] === idx}
                        onChange={() => handleChange(i, idx)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
            >
              Submit Test
            </button>

            {message && (
              <p className="mt-4 text-red-600 text-center">{message}</p>
            )}
          </>
        ) : (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-green-700 text-center">
              ✅ Test Submitted - Score: {score} / {total}
            </h3>
            <ul className="space-y-4">
              {detailedResults.map((result, idx) => (
                <li
                  key={idx}
                  className={`p-4 rounded border ${
                    result.isCorrect ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <p className="font-semibold mb-2">
                    Q{idx + 1}. {result.question}
                  </p>
                  <ul className="space-y-1">
                    {result.options.map((opt, i) => {
                      const isCorrect = i === result.correctAnswer;
                      const isWrong = i === result.userAnswer && !result.isCorrect;

                      return (
                        <li
                          key={i}
                          className={`pl-2 flex items-center gap-2 ${
                            isCorrect
                              ? "text-green-700 font-semibold"
                              : isWrong
                              ? "text-red-700 font-semibold"
                              : ""
                          }`}
                        >
                          {isCorrect && <span>✅</span>}
                          {isWrong && <span>❌</span>}
                          <span>
                            {i + 1}. {opt}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>

            {/* ✅ Retake Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  localStorage.removeItem(`testResult-${subject}-${chapterId}`);
                  setSubmitted(false);
                  setAnswers(new Array(questions.length).fill(null));
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded shadow"
              >
                🔁 Retake Test
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TestPage;
