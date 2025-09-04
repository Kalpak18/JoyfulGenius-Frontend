// src/pages/Admin/AdminUploadChapter.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";

const AdminUploadChapter = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [formData, setFormData] = useState({
    courseId: "",
    subjectId: "",
    title: "",
    language: "",
    youtubeCode: "",
    freetestCode: "",
    mastertestCode: "",
    attemptLimit: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [message, setMessage] = useState("");

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
    if (!s) return "";
    return (s.courseId && (s.courseId._id || s.courseId)) ? String(s.courseId._id ?? s.courseId) : "";
  };

  /* -------------------- Fetch -------------------- */
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(extractArray(res));
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    }
  };

  const fetchSubjects = async (courseId) => {
    if (!courseId) {
      setSubjects([]);
      return;
    }
    try {
      const res = await api.get(`/subjects?courseId=${courseId}`);
      setSubjects(extractArray(res));
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setSubjects([]);
    }
  };

  const fetchChapters = async (courseId = "", subjectId = "") => {
    try {
      let url = "/chapters?";
      if (courseId) url += `courseId=${courseId}&`;
      if (subjectId) url += `subjectId=${subjectId}&`;
      const res = await api.get(url);
      setChapters(extractArray(res));
    } catch (err) {
      console.error("Error fetching chapters:", err);
      setChapters([]);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchChapters(); // fetch all chapters initially
  }, []);

  /* -------------------- Handlers -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "courseId") {
      fetchSubjects(value);
      setFormData((prev) => ({ ...prev, subjectId: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const {
      courseId,
      subjectId,
      title,
      language,
      youtubeCode,
      freetestCode,
      mastertestCode,
      attemptLimit,
    } = formData;

    if (!courseId || !subjectId || !title || !language) {
      alert("Please select course, subject, title, and language.");
      return;
    }

    try {
      await api.post("/chapters", {
        courseId,
        subjectId,
        title,
        language,
        youtubeCode,
        freetestCode,
        mastertestCode,
        attemptLimit: attemptLimit ? Number(attemptLimit) : null,
      });
      setMessage("✅ Chapter saved successfully");
      setFormData({
        courseId,
        subjectId,
        title: "",
        language: "",
        youtubeCode: "",
        freetestCode: "",
        mastertestCode: "",
        attemptLimit: "",
      });
      setEditMode(false);
      fetchChapters(courseId, subjectId);
    } catch (error) {
      console.error("❌ Error saving chapter:", error);
      setMessage("Failed to save chapter. See console.");
    }
  };

  const handleEdit = (chapter) => {
    setFormData({
      courseId: chapter.courseId?._id || chapter.courseId,
      subjectId: chapter.subjectId?._id || chapter.subjectId,
      title: chapter.title,
      language: chapter.language,
      youtubeCode: chapter.youtubeCode,
      freetestCode: chapter.freetestCode,
      mastertestCode: chapter.mastertestCode,
      attemptLimit: chapter.attemptLimit ?? "",
    });
    setEditMode(true);
    fetchSubjects(chapter.courseId?._id || chapter.courseId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this chapter?")) return;
    try {
      await api.delete(`/chapters/${id}`);
      setChapters(chapters.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting chapter:", err);
      alert("Delete failed");
    }
  };

  const filteredChapters = chapters
    .filter((ch) => ch.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const numA = parseInt(a.title.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.title.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  const filteredChaptersByFilter = filteredChapters.filter((ch) => {
    let courseMatch = filterCourse ? (ch.courseId?._id || ch.courseId) === filterCourse : true;
    let subjectMatch = filterSubject ? (ch.subjectId?._id || ch.subjectId) === filterSubject : true;
    return courseMatch && subjectMatch;
  });

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">📘 Admin Upload Chapter</h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-4 grid gap-4 sm:grid-cols-2"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              disabled={!formData.courseId}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            name="title"
            placeholder="Chapter Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded sm:col-span-2"
          />

          <input
            type="text"
            name="language"
            placeholder="Language"
            value={formData.language}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="youtubeCode"
            placeholder="YouTube Code"
            value={formData.youtubeCode}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="freetestCode"
            placeholder="Free Test Code"
            value={formData.freetestCode}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="mastertestCode"
            placeholder="Master Test Code"
            value={formData.mastertestCode}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="attemptLimit"
            placeholder="Attempt Limit"
            value={formData.attemptLimit}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="sm:col-span-2 bg-blue-600 text-white px-3 py-1.5 rounded shadow hover:bg-blue-700 transition text-sm"
          >
            {editMode ? "✏️ Update" : "➕ Add Chapter"}
          </button>
        </form>

        {message && <div className="mb-4 text-blue-600 text-center">{message}</div>}

        {/* Filter */}
        <div className="bg-white p-4 rounded shadow mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Course</label>
            <select
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value);
                setFilterSubject("");
                fetchSubjects(e.target.value);
              }}
              className="border p-2 rounded w-full"
            >
              <option value="">-- All Courses --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filter by Subject</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border p-2 rounded w-full"
              disabled={!filterCourse}
            >
              <option value="">-- All Subjects --</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search chapter title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/2 mb-4"
        />

        {/* Chapters list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChaptersByFilter.length === 0 && (
            <p className="text-gray-500 col-span-full">No chapters found.</p>
          )}
          {filteredChaptersByFilter.map((ch) => (
            <div key={ch._id} className="border p-3 rounded shadow-sm bg-white text-sm">
              <p className="font-semibold text-base">
                {ch.title} ({ch.language})
              </p>
              <p className="text-gray-600">
                📚 Course: {ch.courseId?.name || ch.courseId} | Subject: {ch.subjectId?.name || ch.subjectId}
              </p>
              <p>🎥 YouTube: https://youtu.be/{ch.youtubeCode}</p>
              <p>🧪 Free Test: https://testmoz.com/q/{ch.freetestCode}</p>
              <p>🧪 Master Test: https://testmoz.com/q/{ch.mastertestCode}</p>
              {ch.attemptLimit !== null && <p>🔢 Attempt Limit: {ch.attemptLimit}</p>}

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleEdit(ch)}
                  className="bg-yellow-400 px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ch._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUploadChapter;
