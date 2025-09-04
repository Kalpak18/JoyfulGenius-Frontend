// src/pages/Admin/AdminCourseSubjectChapter.jsx
import { useEffect, useState, useRef  } from "react";
import api from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";

const AdminCourseSubjectChapter = () => {
   const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(""); // filter courses view if needed
  const [message, setMessage] = useState("");
  const usernameInputRef = useRef(null);

  // Course form
  const [courseForm, setCourseForm] = useState({
  name: "",
  description: "",
  language: "",
  usernameFormat: "{serial}.{fname}{lname}.{district}",
  autoGenerateUsername: true
});

  const [editingCourseId, setEditingCourseId] = useState(null);

  // Global subject form (top)
  const [subjectForm, setSubjectForm] = useState({ name: "", description: "", courseId: "" });
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  // Inline subject form tracker (which course card is showing inline form)
  const [inlineForCourse, setInlineForCourse] = useState(null);

  /* -------------------- Helpers -------------------- */
  const extractArray = (res) => {
    if (!res) return [];
    const payload = res.data ?? res;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.results)) return payload.results;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return [];
  };

  const getSubjectCourseId = (s) => {
    // subject.courseId may be populated object or plain id
    if (!s) return "";
    return (s.courseId && (s.courseId._id || s.courseId)) ? String(s.courseId._id ?? s.courseId) : "";
  };

  /* -------------------- Fetch -------------------- */
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(extractArray(res));
    } catch (err) {
      console.error("Error fetching courses", err);
      setCourses([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(extractArray(res));
    } catch (err) {
      console.error("Error fetching subjects", err);
      setSubjects([]);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, []);

  /* -------------------- Course handlers -------------------- */
  const handleCourseChange = (e) => {
  const { name, value, type, checked } = e.target;
  setCourseForm({
    ...courseForm,
    [name]: type === "checkbox" ? checked : value
  });
};


  const handleCourseSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  try {
    if (editingCourseId) {
      await api.put(`/courses/${editingCourseId}`, courseForm);
      setMessage("✅ Course updated successfully");
      setEditingCourseId(null);
    } else {
      await api.post("/courses", courseForm);
      setMessage("✅ Course added successfully");
    }
    setCourseForm({
      name: "",
      description: "",
      language: "",
      usernameFormat: "{serial}.{fname}{lname}.{district}",
      autoGenerateUsername: true,
    });
    await fetchCourses();
  } catch (err) {
    console.error("Save course failed", err);
    setMessage("❌ Failed to save course");
  }
};


  const handleCourseEdit = (c) => {
    setCourseForm({
  name: c.name || "",
  description: c.description || "",
  language: c.language || "",
  usernameFormat: c.usernameFormat || "{serial}.{fname}{lname}.{district}",
  autoGenerateUsername: c.autoGenerateUsername ?? true
});

    setEditingCourseId(c._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCourseDelete = async (id) => {
    const ok = window.confirm(
      "Delete this course? This will also delete its subjects and related chapters. Continue?"
    );
    if (!ok) return;
    try {
      await api.delete(`/courses/${id}`);
      setMessage("✅ Course deleted");
      await fetchCourses();
      await fetchSubjects(); // refresh subjects (cascade-delete)
    } catch (err) {
      console.error("Delete course failed", err);
      setMessage("❌ Failed to delete course");
    }
  };

  /* -------------------- Subject handlers -------------------- */
  const handleSubjectChange = (e) => {
    setSubjectForm({ ...subjectForm, [e.target.name]: e.target.value });
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (!subjectForm.courseId) {
        setMessage("❗ Choose a course for the subject.");
        return;
      }

      if (editingSubjectId) {
        await api.put(`/subjects/${editingSubjectId}`, subjectForm);
        setMessage("✅ Subject updated successfully");
        setEditingSubjectId(null);
      } else {
        await api.post("/subjects", subjectForm);
        setMessage("✅ Subject added successfully");
      }

      setSubjectForm({ name: "", description: "", courseId: "" });
      setInlineForCourse(null);
      await fetchSubjects();
    } catch (err) {
      console.error("Save subject failed", err);
      setMessage("❌ Failed to save subject");
    }
  };

  const handleSubjectEdit = (s) => {
    const courseId = getSubjectCourseId(s) || s.courseId || "";
    setSubjectForm({
      name: s.name || "",
      description: s.description || "",
      courseId,
    });
    setEditingSubjectId(s._id);
    setInlineForCourse(courseId); // open inline UI under the subject's course
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubjectDelete = async (id) => {
    const ok = window.confirm("Delete this subject? This action cannot be undone.");
    if (!ok) return;
    try {
      await api.delete(`/subjects/${id}`);
      setMessage("✅ Subject deleted");
      await fetchSubjects();
    } catch (err) {
      console.error("Delete subject failed", err);
      setMessage("❌ Failed to delete subject");
    }
  };

  const openInlineAddForCourse = (courseId) => {
    setInlineForCourse(courseId);
    setEditingSubjectId(null);
    setSubjectForm({ name: "", description: "", courseId });
    // small delay then scroll to bottom area (optional)
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 150);
  };

  const cancelInlineSubject = () => {
    setInlineForCourse(null);
    setEditingSubjectId(null);
    setSubjectForm({ name: "", description: "", courseId: "" });
  };

  /* -------------------- Derived data -------------------- */
  const filteredCourses = Array.isArray(courses)
    ? (selectedCourse ? courses.filter((c) => String(c._id) === String(selectedCourse)) : courses)
    : [];

  const subjectsByCourse = (courseId) =>
    Array.isArray(subjects)
      ? subjects.filter((s) => String(getSubjectCourseId(s)) === String(courseId))
      : [];

  return (
    <>
      <AdminHeader />
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Manage Courses & Subjects</h2>

       <form onSubmit={handleCourseSubmit} className="space-y-4 mb-6">
  <h3 className="text-lg font-semibold">Add / Edit Course</h3>

  <div className="flex flex-col gap-3">
    {/* -------------------- Basic fields -------------------- */}
    <input
      name="name"
      value={courseForm.name}
      onChange={handleCourseChange}
      placeholder="Course Name"
      className="w-full p-2 border rounded"
    />
    <input
      name="language"
      value={courseForm.language}
      onChange={handleCourseChange}
      placeholder="Language"
      className="w-full p-2 border rounded"
    />
    <input
      name="description"
      value={courseForm.description}
      onChange={handleCourseChange}
      placeholder="Short description"
      className="w-full p-2 border rounded"
    />

    {/* -------------------- Username options -------------------- */}
    <div className="flex flex-col gap-2 mt-2">
      <span className="font-medium">Username Options:</span>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={courseForm.autoGenerateUsername}
          onChange={() =>
            setCourseForm({
              ...courseForm,
              autoGenerateUsername: !courseForm.autoGenerateUsername,
              customUsername: false,
              noUsername: false,
            })
          }
          className="h-4 w-4"
        />
        Auto-generate username
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={courseForm.customUsername}
          onChange={() =>
            setCourseForm({
              ...courseForm,
              customUsername: !courseForm.customUsername,
              autoGenerateUsername: false,
              noUsername: false,
            })
          }
          className="h-4 w-4"
        />
        Custom username format
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={courseForm.noUsername}
          onChange={() =>
            setCourseForm({
              ...courseForm,
              noUsername: !courseForm.noUsername,
              autoGenerateUsername: false,
              customUsername: false,
            })
          }
          className="h-4 w-4"
        />
        No username
      </label>
    </div>

    {/* -------------------- Custom username input -------------------- */}
    {courseForm.customUsername && (
      <div className="mt-2 p-3 border rounded bg-gray-50">
        <label className="text-sm font-medium mb-1 block">
          Define custom username format:
        </label>
        <input
          name="usernameFormat"
          value={courseForm.usernameFormat}
          onChange={handleCourseChange}
          placeholder="e.g., {serial}.{fname}{lname}.{district}"
          className="w-full p-2 border rounded"
          ref={usernameInputRef} // cursor insertion
        />
        <div className="text-xs text-gray-600 mt-1">
          Click placeholders to insert at cursor:{" "}
          {["{serial}", "{fname}", "{lname}", "{district}", ".", "_"].map((ph) => (
            <button
              key={ph}
              type="button"
              className="underline mr-1"
              onClick={() => {
                const input = usernameInputRef.current;
                if (!input) return;
                const start = input.selectionStart;
                const end = input.selectionEnd;
                const text = courseForm.usernameFormat;
                const newText = text.substring(0, start) + ph + text.substring(end);
                setCourseForm({ ...courseForm, usernameFormat: newText });
                setTimeout(() => {
                  input.focus();
                  input.setSelectionRange(start + ph.length, start + ph.length);
                }, 0);
              }}
            >
              {ph}
            </button>
          ))}
          . You can also use `.` or `_`.
        </div>
      </div>
    )}

    {/* -------------------- Auto-generate example -------------------- */}
    {courseForm.autoGenerateUsername && (
      <div className="text-sm text-gray-600 mt-1">
        Example: 1.johnsmith.mumbai
      </div>
    )}
  </div>

  {/* -------------------- Submit buttons -------------------- */}
  <div className="flex gap-3 mt-2">
    <button
      type="submit"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      {editingCourseId ? "Update Course" : "Add Course"}
    </button>
    {editingCourseId && (
      <button
        type="button"
        onClick={() => {
          setEditingCourseId(null);
          setCourseForm({
            name: "",
            description: "",
            language: "",
            usernameFormat: "{serial}.{fname}{lname}.{district}",
            autoGenerateUsername: true,
            customUsername: false,
            noUsername: false,
          });
        }}
        className="px-4 py-2 rounded border"
      >
        Cancel
      </button>
    )}
  </div>
</form>

        {/* -------------------- Global Subject Form (optional) -------------------- */}
        <form onSubmit={handleSubjectSubmit} className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold">Add / Edit Subject (Global)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              name="name"
              value={subjectForm.name}
              onChange={handleSubjectChange}
              placeholder="Subject Name"
              className="w-full p-2 border rounded"
            />
            <input
              name="description"
              value={subjectForm.description}
              onChange={handleSubjectChange}
              placeholder="Short description"
              className="w-full p-2 border rounded"
            />
            <select
              name="courseId"
              value={subjectForm.courseId}
              onChange={handleSubjectChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Course</option>
              {Array.isArray(courses) &&
                courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {editingSubjectId ? "Update Subject" : "Add Subject"}
            </button>
            {(editingSubjectId || subjectForm.name || subjectForm.description) && (
              <button
                type="button"
                onClick={() => {
                  setEditingSubjectId(null);
                  setSubjectForm({ name: "", description: "", courseId: "" });
                }}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <div className="text-center text-sm mb-6 text-blue-600">{message}</div>}

        {/* -------------------- Filter (optional) -------------------- */}
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm">Show:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Courses</option>
            {Array.isArray(courses) &&
              courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
          <button
            onClick={() => {
              setSelectedCourse("");
            }}
            className="px-3 py-1 border rounded text-sm"
          >
            Reset
          </button>
        </div>

        {/* -------------------- Nested grouped list (Course -> Subjects) -------------------- */}
        <h3 className="text-xl font-semibold mb-3">Courses & Subjects</h3>
        <div className="space-y-4">
          {Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
            filteredCourses.map((c) => (
              <div key={c._id} className="bg-white border rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <strong className="text-lg">{c.name}</strong>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{c.language}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCourseEdit(c)}
                      className="text-blue-600 hover:underline px-3 py-1 border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCourseDelete(c._id)}
                      className="text-red-500 hover:underline px-3 py-1 border rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openInlineAddForCourse(c._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      + Add Subject
                    </button>
                  </div>
                </div>

                {/* Inline subject form under course */}
                {String(inlineForCourse) === String(c._id) && (
                  <div className="mt-4 p-3 bg-gray-50 border rounded">
                    <h4 className="font-medium mb-2">Add / Edit Subject for <span className="font-semibold">{c.name}</span></h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        name="name"
                        value={subjectForm.name}
                        onChange={handleSubjectChange}
                        placeholder="Subject name"
                        className="p-2 border rounded"
                      />
                      <input
                        name="description"
                        value={subjectForm.description}
                        onChange={handleSubjectChange}
                        placeholder="Short description"
                        className="p-2 border rounded"
                      />
                      <select
                        name="courseId"
                        value={subjectForm.courseId || c._id}
                        onChange={handleSubjectChange}
                        className="p-2 border rounded"
                      >
                        {Array.isArray(courses) &&
                          courses.map((cc) => (
                            <option key={cc._id} value={cc._id}>
                              {cc.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={handleSubjectSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        {editingSubjectId ? "Update Subject" : "Add Subject"}
                      </button>
                      <button onClick={cancelInlineSubject} className="px-4 py-2 rounded border">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Subjects list for this course */}
                <ul className="pl-4 border-l ml-2 mt-4 space-y-2">
                  {subjectsByCourse(c._id).length > 0 ? (
                    subjectsByCourse(c._id).map((s) => (
                      <li key={s._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div>
                          <div className="font-medium">{s.name}</div>
                          {s.description && <div className="text-xs text-gray-600">{s.description}</div>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubjectEdit(s)}
                            className="text-blue-600 hover:underline px-3 py-1 border rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleSubjectDelete(s._id)}
                            className="text-red-500 hover:underline px-3 py-1 border rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">No subjects added yet.</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-6">No courses found.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCourseSubjectChapter;
