


import { useEffect, useState } from "react";
import api from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";
import Swal from 'sweetalert2';

const AdminQuestions = () => {
  // ----- existing form shape preserved (subject/chapter are text) -----
  const [form, setForm] = useState({
    subject: "",
    chapter: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  // NEW: course for the form + resolved IDs (kept internal)
  const [formCourseId, setFormCourseId] = useState("");
  const [formSubjectId, setFormSubjectId] = useState("");
  const [formChapterId, setFormChapterId] = useState("");

  // Lists for hierarchy (form)
  const [courses, setCourses] = useState([]);
  const [subjectsForm, setSubjectsForm] = useState([]); // subjects for selected form course
  const [chaptersForm, setChaptersForm] = useState([]); // chapters for selected form subject

  // ----- existing state -----
  const [questions, setQuestions] = useState([]);

  // Kept, but we no longer rely on /questions/all-metadata for suggestions;
  // we’ll source suggestions from subjectsForm/chaptersForm.
  const [metadata, setMetadata] = useState([]);

  // Filters (MANDATORY now)
  const [filterCourseId, setFilterCourseId] = useState("");
  const [filterSubjectId, setFilterSubjectId] = useState("");
  const [filterChapterId, setFilterChapterId] = useState("");

  const [filterSubjects, setFilterSubjects] = useState([]);
  const [filterChapters, setFilterChapters] = useState([]);

  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ---------------- Helpers ----------------
  const extractArray = (res) => {
    if (!res) return [];
    const payload = res.data ?? res;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.results)) return payload.results;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return [];
  };

  const resetFormFields = (keepCourse = true) => {
    setForm({
      subject: "",
      chapter: "",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
    if (!keepCourse) setFormCourseId("");
    setFormSubjectId("");
    setFormChapterId("");
    setChaptersForm([]);
  };

  // Keep your original getChaptersForSubject API (but back it with chaptersForm)
  const getChaptersForSubject = (subjectName) => {
    if (!subjectName || !formSubjectId) return [];
    // chaptersForm already filtered for selected subject by fetch
    return chaptersForm.map((c) => c.title);
  };

  // ---------------- Fetch base lists ----------------
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/courses");
        setCourses(extractArray(res));
      } catch (e) {
        console.error("Error fetching courses:", e);
        setCourses([]);
      }
    })();
  }, []);

  // Keep your metadata fetch (not critical now, but preserved)
  const fetchMetadata = async () => {
    try {
      const res = await api.get("/questions/metadata");
      setMetadata(extractArray(res));
    } catch (err) {
      console.error("Error fetching metadata", err);
    }
  };
  useEffect(() => {
    fetchMetadata();
  }, []);

  // ----- Form hierarchy -----
  // When course changes in form -> fetch subjects
  useEffect(() => {
    if (!formCourseId) {
      setSubjectsForm([]);
      setChaptersForm([]);
      setFormSubjectId("");
      setFormChapterId("");
      setForm((prev) => ({ ...prev, subject: "", chapter: "" }));
      return;
    }
    (async () => {
      try {
        const res = await api.get(`/subjects?courseId=${formCourseId}`);
        const subs = extractArray(res);
        setSubjectsForm(subs);
        // if user typed a subject name that exists in this course, set id
        const found = subs.find((s) => s.name === form.subject);
        setFormSubjectId(found ? found._id : "");
        setChaptersForm([]);
        setFormChapterId("");
      } catch (e) {
        console.error("Error fetching form subjects:", e);
        setSubjectsForm([]);
      }
    })();
  }, [formCourseId]);

  // When subject text changes -> find subjectId and fetch chapters
  useEffect(() => {
    if (!formCourseId) return;

    const subj = subjectsForm.find((s) => s.name === form.subject);
    const nextSubjectId = subj ? subj._id : "";
    setFormSubjectId(nextSubjectId);

    if (!nextSubjectId) {
      setChaptersForm([]);
      setFormChapterId("");
      return;
    }

    (async () => {
      try {
        const res = await api.get(`/chapters?courseId=${formCourseId}&subjectId=${nextSubjectId}`);
        const chs = extractArray(res);
        setChaptersForm(chs);
        const foundCh = chs.find((c) => c.title === form.chapter);
        setFormChapterId(foundCh ? foundCh._id : "");
      } catch (e) {
        console.error("Error fetching form chapters:", e);
        setChaptersForm([]);
      }
    })();
  }, [form.subject, formCourseId, subjectsForm]); // reacts when subject text or course changes

  // When chapter text changes -> resolve chapterId from chaptersForm
  useEffect(() => {
    if (!chaptersForm.length) {
      setFormChapterId("");
      return;
    }
    const ch = chaptersForm.find((c) => c.title === form.chapter);
    setFormChapterId(ch ? ch._id : "");
  }, [form.chapter, chaptersForm]);

  // ---------------- Filters (mandatory) ----------------
  // Fetch subjects for filter course
  useEffect(() => {
    setFilterSubjects([]);
    setFilterSubjectId("");
    setFilterChapters([]);
    setFilterChapterId("");
    setQuestions([]);
    if (!filterCourseId) return;

    (async () => {
      try {
        const res = await api.get(`/subjects?courseId=${filterCourseId}`);
        setFilterSubjects(extractArray(res));
      } catch (e) {
        console.error("Error fetching filter subjects:", e);
        setFilterSubjects([]);
      }
    })();
  }, [filterCourseId]);

  // Fetch chapters for filter subject
  useEffect(() => {
    setFilterChapters([]);
    setFilterChapterId("");
    setQuestions([]);
    if (!filterCourseId || !filterSubjectId) return;

    (async () => {
      try {
        const res = await api.get(
          `/chapters?courseId=${filterCourseId}&subjectId=${filterSubjectId}`
        );
        setFilterChapters(extractArray(res));
      } catch (e) {
        console.error("Error fetching filter chapters:", e);
        setFilterChapters([]);
      }
    })();
  }, [filterSubjectId, filterCourseId]);

  // Fetch questions ONLY when all three filters are selected (mandatory filter)
  const fetchQuestions = async () => {
    if (!filterCourseId || !filterSubjectId || !filterChapterId) {
      setQuestions([]);
      return;
    }
    try {
      const res = await api.get(
        `/questions?courseId=${filterCourseId}&subjectId=${filterSubjectId}&chapterId=${filterChapterId}`
      );
      setQuestions(extractArray(res));
    } catch (err) {
      console.error("Error fetching questions", err);
      setQuestions([]);
    }
  };
  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCourseId, filterSubjectId, filterChapterId]);

  // ---------------- Handlers (keep your structure) ----------------
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

    // validate presence of ids
    if (!formCourseId || !formSubjectId || !formChapterId) {
      setMessage("❌ Please select Course, then choose Subject & Chapter from suggestions.");
      return;
    }
    if (form.options.some((o) => !o || !o.trim())) {
      setMessage("❌ All four options are required.");
      return;
    }

    try {
      const payload = {
        courseId: formCourseId,
        subjectId: formSubjectId,
        chapterId: formChapterId,
        question: form.question,
        options: form.options,
        correctAnswer: Number(form.correctAnswer),
      };

      if (editingId) {
        await api.patch(`/questions/${editingId}`, payload);
        setMessage("✅ Question updated successfully");
        setEditingId(null);
      } else {
        await api.post("/questions", payload);
        setMessage("✅ Question added successfully");
      }

      // keep the same course to speed up multiple entries
      resetFormFields(true);
      fetchQuestions();
    } catch (err) {
      console.error("Save failed", err);
      setMessage("❌ Failed to save question");
    }
  };

 const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/questions/${id}`);
    await Swal.fire('Deleted!', 'The question has been deleted.', 'success');
    fetchQuestions();
  } catch (err) {
    console.error("Delete failed", err);
    await Swal.fire('Error!', 'Failed to delete question.', 'error');
  }
};

  const handleEdit = async (q) => {
    try {
      // q may have ids only; use those to hydrate the form cascade
      const qCourseId = q.courseId?._id || q.courseId;
      const qSubjectId = q.subjectId?._id || q.subjectId;
      const qChapterId = q.chapterId?._id || q.chapterId;

      setEditingId(q._id);
      setForm({
        subject: "",
        chapter: "",
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      });

      // 1) set course and fetch subjects
      setFormCourseId(qCourseId || "");
      if (!qCourseId) return;

      const subsRes = await api.get(`/subjects?courseId=${qCourseId}`);
      const subs = extractArray(subsRes);
      setSubjectsForm(subs);

      // 2) set subject text by looking up name
      const subj = subs.find((s) => (s._id === qSubjectId));
      setFormSubjectId(qSubjectId || "");
      setForm((prev) => ({ ...prev, subject: subj?.name || "" }));

      if (!qSubjectId) return;

      // 3) fetch chapters for that subject
      const chRes = await api.get(`/chapters?courseId=${qCourseId}&subjectId=${qSubjectId}`);
      const chs = extractArray(chRes);
      setChaptersForm(chs);

      // 4) set chapter text
      const chapter = chs.find((c) => (c._id === qChapterId));
      setFormChapterId(qChapterId || "");
      setForm((prev) => ({ ...prev, chapter: chapter?.title || "" }));

      // scroll up (preserved behavior)
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error("Edit hydrate failed:", e);
    }
  };

  // ---------------- UI (kept layout; just added Course + hierarchy) ----------------
  return (
    <>
      <AdminHeader />
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Manage Quiz Questions</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NEW: Course select (required) */}
          <div>
            <select
              value={formCourseId}
              onChange={(e) => {
                setFormCourseId(e.target.value);
                // reset subject/chapter text so user picks from this course
                setForm((prev) => ({ ...prev, subject: "", chapter: "" }));
              }}
              className="w-full p-2 border rounded bg-white"
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subject Input (kept your datalist UX; now backed by subjectsForm of selected course) */}
          <div className="relative">
  <select
    name="subject"
    value={form.subject}
    onChange={(e) => {
      // Update subject text and reset chapter
      setForm({ ...form, subject: e.target.value, chapter: "" });
      setFormChapterId(""); // Reset chapter ID
    }}
    className="w-full p-2 border rounded bg-white"
    disabled={!formCourseId}
    required
  >
    <option value="">Select Subject</option>
    {subjectsForm.map((s) => (
      <option key={s._id} value={s.name}>
        {s.name}
      </option>
    ))}
  </select>
  {/* Dropdown arrow icon (optional) */}
  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div>

          {/* Chapter Suggestions (kept) — now shows chapters for selected subject from API */}
          {form.subject && !!formSubjectId && (
            <div className="bg-white border rounded p-2 max-h-48 overflow-y-auto shadow-sm">
              {getChaptersForSubject(form.subject).length > 0 ? (
                getChaptersForSubject(form.subject).map((ch) => (
                  <div
                    key={ch}
                    className="text-sm p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => setForm({ ...form, chapter: ch })}
                  >
                    {ch}
                  </div>
                ))
              ) : (
                <div className="text-sm p-2 text-gray-500">No chapters found for this subject</div>
              )}
            </div>
          )}

          {/* Chapter Input (kept) */}
          <select
  name="chapter"
  value={form.chapter}
  onChange={handleChange}
  className="w-full p-2 border rounded bg-white"
  disabled={!formSubjectId}
  required
>
  <option value="">Select Chapter</option>
  {chaptersForm.map((ch) => (
    <option key={ch._id} value={ch.title}>
      {ch.title}
    </option>
  ))}
</select>

          {/* Question and Options (kept) */}
          <textarea
            name="question"
            value={form.question}
            onChange={handleChange}
            placeholder="Question"
            className="w-full p-2 border rounded min-h-[100px]"
            required
          />

          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              value={form.options[i]}
              onChange={(e) => handleChange(e, i)}
              placeholder={`Option ${i + 1}`}
              className="w-full p-2 border rounded"
              required
            />
          ))}

          {/* Correct Answer Dropdown (kept) */}
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
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {editingId ? "Update Question" : "Add Question"}
          </button>
          {message && <div className="text-center text-sm mt-2 text-blue-600">{message}</div>}
        </form>

        <hr className="my-6 border-gray-200" />

        {/* Filter Section (now mandatory, with course → subject → chapter) */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Filter Existing Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Course Filter */}
            <div className="relative">
              <select
                value={filterCourseId}
                onChange={(e) => {
                  setFilterCourseId(e.target.value);
                }}
                className="w-full p-2.5 border rounded bg-white appearance-none"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id} className="truncate">
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <select
                value={filterSubjectId}
                onChange={(e) => setFilterSubjectId(e.target.value)}
                className="w-full p-2.5 border rounded bg-white appearance-none"
                disabled={!filterCourseId}
              >
                <option value="">Select Subject</option>
                {filterSubjects.map((s) => (
                  <option key={s._id} value={s._id} className="truncate">
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Chapter Filter */}
            <div className="relative">
              <select
                value={filterChapterId}
                onChange={(e) => setFilterChapterId(e.target.value)}
                className="w-full p-2.5 border rounded bg-white appearance-none"
                disabled={!filterSubjectId}
              >
                <option value="">Select Chapter</option>
                {filterChapters.map((ch) => (
                  <option key={ch._id} value={ch._id} className="truncate">
                    {ch.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tip: Filters are required to load questions (keeps the page light).
          </p>
        </div>

        {/* Questions List (cards; show only question, keep Edit/Delete) */}
        <ul className="space-y-3">
          {questions.map((q) => (
            <li
              key={q._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{q.question}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Correct: Option {Number(q.correctAnswer) + 1}
                  </p>
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
          {(!filterCourseId || !filterSubjectId || !filterChapterId) && (
            <li className="text-gray-500 text-sm">Select course, subject, and chapter to view questions.</li>
          )}
          {filterCourseId && filterSubjectId && filterChapterId && questions.length === 0 && (
            <li className="text-gray-500 text-sm">No questions found for the selected filters.</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default AdminQuestions;
