// import { useEffect, useState } from "react";
// import api from "../../utils/axios";
// import AdminHeader from "../../components/Admin/AdminHeader";

// const AdminQuestions = () => {
//   const [form, setForm] = useState({
//     subject: "",
//     chapter: "",
//     question: "",
//     options: ["", "", "", ""],
//     correctAnswer: 0,
//   });
//   const [questions, setQuestions] = useState([]);
//   const [metadata, setMetadata] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedChapter, setSelectedChapter] = useState("");
//   const [message, setMessage] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   const fetchMetadata = async () => {
//     try {
//       const res = await api.get("/questions/all-metadata");
//       setMetadata(res.data);
//     } catch (err) {
//       console.error("Error fetching metadata", err);
//     }
//   };

//   const fetchQuestions = async () => {
//     if (!selectedSubject || !selectedChapter) return;
//     try {
//       const res = await api.get(`/questions/${selectedSubject}/${selectedChapter}`);
//       setQuestions(res.data);
//     } catch (err) {
//       console.error("Error fetching questions", err);
//     }
//   };

//   useEffect(() => {
//     fetchMetadata();
//   }, []);

//   useEffect(() => {
//     fetchQuestions();
//   }, [selectedSubject, selectedChapter]);

//   const handleChange = (e, index) => {
//     if (index >= 0) {
//       const newOptions = [...form.options];
//       newOptions[index] = e.target.value;
//       setForm({ ...form, options: newOptions });
//     } else {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       if (editingId) {
//         await api.put(`/questions/${editingId}`, form);
//         setMessage("✅ Question updated successfully");
//         setEditingId(null);
//       } else {
//         await api.post("/questions/add", form);
//         setMessage("✅ Question added successfully");
//       }

//       setForm({ subject: "", chapter: "", question: "", options: ["", "", "", ""], correctAnswer: 0 });
//       fetchQuestions();
//     } catch (err) {
//       console.error("Save failed", err);
//       setMessage("❌ Failed to save question");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/questions/${id}`);
//       fetchQuestions();
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   const handleEdit = (q) => {
//     setForm({
//       subject: q.subject,
//       chapter: q.chapter,
//       question: q.question,
//       options: q.options,
//       correctAnswer: q.correctAnswer,
//     });
//     setEditingId(q._id);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <>
//       <AdminHeader />
//       <div className="max-w-5xl mx-auto p-4 md:p-6">
//         <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Manage Quiz Questions</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="subject"
//             value={form.subject}
//             onChange={handleChange}
//             placeholder="Subject"
//             className="w-full p-2 border rounded"
//           />
//           {/* Filtered chapter suggestions based on subject */}
//           <div className="bg-white border rounded p-2">
//             {form.subject &&
//               [...new Set(metadata.filter(m => m.subject === form.subject).map(m => m.chapter))].map(ch => (
//                 <div
//                   key={ch}
//                   className="text-sm p-1 hover:bg-blue-100 cursor-pointer"
//                   onClick={() => setForm({ ...form, chapter: ch })}
//                 >
//                   {ch}
//                 </div>
//               ))}
//           </div>

//           <input
//             name="chapter"
//             value={form.chapter}
//             onChange={handleChange}
//             placeholder="Chapter"
//             className="w-full p-2 border rounded"
//           />
//           <textarea
//             name="question"
//             value={form.question}
//             onChange={handleChange}
//             placeholder="Question"
//             className="w-full p-2 border rounded"
//           />
//           {[0, 1, 2, 3].map((i) => (
//             <input
//               key={i}
//               value={form.options[i]}
//               onChange={(e) => handleChange(e, i)}
//               placeholder={`Option ${i + 1}`}
//               className="w-full p-2 border rounded"
//             />
//           ))}

//           <div className="relative">
//             <select
//               name="correctAnswer"
//               value={form.correctAnswer}
//               onChange={handleChange}
//               className="w-full p-2 border rounded bg-white"
//               style={{ maxWidth: "100%", overflowX: "auto" }}
//             >
//               {[0, 1, 2, 3].map((i) => (
//                 <option key={i} value={i}>{`Option ${i + 1}`}</option>
//               ))}
//             </select>
//           </div>

//           <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//             {editingId ? "Update Question" : "Add Question"}
//           </button>
//           {message && <div className="text-center text-sm mt-2 text-blue-600">{message}</div>}
//         </form>

//         <hr className="my-6" />

//         <h3 className="text-xl font-semibold mb-2">Filter Existing Questions</h3>
//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <select
//             value={selectedSubject}
//             onChange={(e) => {
//               setSelectedSubject(e.target.value);
//               setSelectedChapter("");
//             }}
//             className="p-2 border rounded max-w-full"
//             style={{ maxWidth: "100%" }}
//           >
//             <option value="">Select Subject</option>
//             {[...new Set(metadata.map((m) => m.subject))].map((subj) => (
//               <option key={subj} value={subj}>
//                 {subj}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedChapter}
//             onChange={(e) => setSelectedChapter(e.target.value)}
//             className="p-2 border rounded max-w-full"
//             style={{ maxWidth: "100%" }}
//           >
//             <option value="">Select Chapter</option>
//             {metadata
//               .filter((m) => m.subject === selectedSubject)
//               .map((m) => (
//                 <option key={m.chapter} value={m.chapter}>
//                   {m.chapter}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <ul className="space-y-2">
//           {questions.map((q) => (
//             <li key={q._id} className="bg-gray-100 p-3 rounded flex flex-col md:flex-row justify-between items-start md:items-center">
//               <div className="mb-2 md:mb-0">
//                 <strong>{q.question}</strong>
//                 <div className="text-sm text-gray-600">Correct: Option {q.correctAnswer + 1}</div>
//               </div>
//               <div className="flex gap-4">
//                 <button onClick={() => handleEdit(q)} className="text-blue-600 hover:underline">Edit</button>
//                 <button onClick={() => handleDelete(q._id)} className="text-red-500 hover:underline">Delete</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default AdminQuestions;


import { useEffect, useState } from "react";
import api from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";

const AdminQuestions = () => {
  const [form, setForm] = useState({
    subject: "",
    chapter: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });
  const [questions, setQuestions] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchMetadata = async () => {
    try {
      const res = await api.get("/questions/all-metadata");
      setMetadata(res.data);
    } catch (err) {
      console.error("Error fetching metadata", err);
    }
  };

  const fetchQuestions = async () => {
    if (!selectedSubject || !selectedChapter) return;
    try {
      const res = await api.get(`/questions/${selectedSubject}/${selectedChapter}`);
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions", err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedSubject, selectedChapter]);

  const handleChange = (e, index) => {
    if (index >= 0) {
      const newOptions = [...form.options];
      newOptions[index] = e.target.value;
      setForm({ ...form, options: newOptions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        await api.put(`/questions/${editingId}`, form);
        setMessage("✅ Question updated successfully");
        setEditingId(null);
      } else {
        await api.post("/questions/add", form);
        setMessage("✅ Question added successfully");
      }

      setForm({ subject: "", chapter: "", question: "", options: ["", "", "", ""], correctAnswer: 0 });
      fetchQuestions();
    } catch (err) {
      console.error("Save failed", err);
      setMessage("❌ Failed to save question");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (q) => {
    setForm({
      subject: q.subject,
      chapter: q.chapter,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    });
    setEditingId(q._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

   const getChaptersForSubject = (subject) => {
    if (!subject) return [];
    return [...new Set(metadata
      .filter(m => m.subject === subject)
      .map(m => m.chapter)
    )];
  };
  return (
    <>
      <AdminHeader />
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Manage Quiz Questions</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Input */}
          <div className="relative">
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full p-2 border rounded"
              list="subject-list"
            />
            <datalist id="subject-list">
              {[...new Set(metadata.map(m => m.subject))].map(subj => (
                <option key={subj} value={subj} />
              ))}
            </datalist>
          </div>

          {/* Chapter Suggestions */}
           {form.subject && (
            <div className="bg-white border rounded p-2 max-h-48 overflow-y-auto shadow-sm">
              {getChaptersForSubject(form.subject).length > 0 ? (
                getChaptersForSubject(form.subject).map(ch => (
                  <div
                    key={ch}
                    className="text-sm p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => setForm({ ...form, chapter: ch })}
                  >
                    {ch}
                  </div>
                ))
              ) : (
                <div className="text-sm p-2 text-gray-500">
                  No chapters found for this subject
                </div>
              )}
            </div>
          )}

          {/* Chapter Input */}
          <input
            name="chapter"
            value={form.chapter}
            onChange={handleChange}
            placeholder="Chapter"
            className="w-full p-2 border rounded"
          />

          {/* Question and Options */}
          <textarea
            name="question"
            value={form.question}
            onChange={handleChange}
            placeholder="Question"
            className="w-full p-2 border rounded min-h-[100px]"
          />
          
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              value={form.options[i]}
              onChange={(e) => handleChange(e, i)}
              placeholder={`Option ${i + 1}`}
              className="w-full p-2 border rounded"
            />
          ))}

          {/* Correct Answer Dropdown */}
          <div className="relative">
            <select
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white appearance-none"
            >
              {[0, 1, 2, 3].map((i) => (
                <option key={i} value={i}>{`Option ${i + 1}`}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <button type="submit" className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            {editingId ? "Update Question" : "Add Question"}
          </button>
          {message && <div className="text-center text-sm mt-2 text-blue-600">{message}</div>}
        </form>

        <hr className="my-6 border-gray-200" />

        {/* Filter Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Filter Existing Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedChapter("");
                }}
                className="w-full p-2.5 border rounded bg-white appearance-none"
              >
                <option value="">Select Subject</option>
                {[...new Set(metadata.map((m) => m.subject))].map((subj) => (
                  <option key={subj} value={subj} className="truncate">
                    {subj}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Chapter Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full p-2.5 border rounded bg-white appearance-none"
                disabled={!selectedSubject}
              >
                <option value="">Select Chapter</option>
                {metadata
                  .filter((m) => m.subject === selectedSubject)
                  .map((m) => (
                    <option key={m.chapter} value={m.chapter} className="truncate">
                      {m.chapter}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <ul className="space-y-3">
          {questions.map((q) => (
            <li key={q._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{q.question}</p>
                  <p className="text-sm text-gray-600 mt-1">Correct: Option {q.correctAnswer + 1}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleEdit(q)} 
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(q._id)} 
                    className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminQuestions;