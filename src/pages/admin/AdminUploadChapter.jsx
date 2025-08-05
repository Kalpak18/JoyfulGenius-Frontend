import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";

const AdminUploadChapter = () => {
  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    language: "",
    youtubeCode: "",
    freetestCode: "",
    mastertestCode: "",
  });

  const [chapters, setChapters] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [allSubjects, setAllSubjects] = useState([]);

  const fetchChapters = async () => {
    try {
      const res = await api.get("/chapter");
      const chapterArray = Array.isArray(res.data) ? res.data : [];
      setChapters(chapterArray);
      const subjects = [
        ...new Set(chapterArray.map((ch) => ch.subject).filter(Boolean)),
      ];
      setAllSubjects(subjects);
    } catch (err) {
      console.error("Error fetching chapters:", err);
      setChapters([]);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { subject, title, language, youtubeCode, freetestCode, mastertestCode } = formData;
    if (!subject || !title || !language) {
      alert("Please fill in subject, title, and language.");
      return;
    }
    try {
      await api.post("/chapter/", {
        subject,
        title,
        language,
        youtubeCode,
        freetestCode,
        mastertestCode,
      });
      alert("✅ Chapter saved successfully!");
      setFormData({
        subject: "",
        title: "",
        language: "",
        youtubeCode: "",
        freetestCode: "",
        mastertestCode: "",
      });
      setEditMode(false);
      fetchChapters();
    } catch (error) {
      console.error("❌ Error saving chapter:", error);
      alert("Failed to save chapter. Please check console.");
    }
  };

  const handleEdit = (chapter) => {
    setFormData({
      subject: chapter.subject,
      title: chapter.title,
      language: chapter.language,
      youtubeCode: chapter.youtubeCode,
      freetestCode: chapter.freetestCode,
      mastertestCode: chapter.mastertestCode,
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this chapter?")) return;
    try {
      await api.delete(`/chapter/${id}`);
      setChapters(chapters.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting chapter:", err);
      alert("Delete failed");
    }
  };

  const filteredChapters = chapters
  .filter((ch) => {
    const matchesSearch = ch.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "all" || ch.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  })
  .sort((a, b) => {
    const numA = parseInt(a.title.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.title.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });


  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">📘 Admin Upload Chapter</h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:flex sm:gap-4 sm:items-start w-full sm:col-span-2">
            <div className="flex-1 mb-3 sm:mb-0">
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                value={formData.subject}
                className="border p-2 rounded w-full mb-2"
              >
                <option value="">-- Select Subject --</option>
                {allSubjects.map((subj) => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
              <input
                type="text"
                name="subject"
                placeholder="Or type new subject"
                value={formData.subject}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Chapter Title</label>
              {formData.subject && (
                <select
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border p-2 rounded w-full mb-2"
                >
                  <option value="">-- Select Chapter (or type below) --</option>
                  {chapters
                    .filter((c) => c.subject === formData.subject)
                    .map((c, idx) => (
                      <option key={idx} value={c.title}>{c.title}</option>
                    ))}
                </select>
              )}
              <input
                type="text"
                name="title"
                placeholder="Or type new Chapter Title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

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

          <button
            type="submit"
            className="sm:col-span-2 bg-blue-600 text-white px-3 py-1.5 rounded shadow hover:bg-blue-700 transition text-sm"
          >
            {editMode ? "✏️ Update" : "➕ Add Chapter"}
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <input
            type="text"
            placeholder="🔍 Search chapter title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/2"
          />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/3"
          >
            <option value="all">All Subjects</option>
            {allSubjects.map((subj) => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>
        </div>

       {subjectFilter !== "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChapters.length === 0 && (
            <p className="text-gray-500 col-span-full">No chapters found.</p>
          )}
          {filteredChapters.map((ch) => (
            <div
              key={ch._id}
              className="border p-3 rounded shadow-sm bg-white text-sm"
            >
              <p className="font-semibold text-base">{ch.title} ({ch.language})</p>
              <p className="text-gray-600">📚 Subject: {ch.subject}</p>
              <p>🎥 YouTube: <a href={`https://youtu.be/${ch.youtubeCode}`} className="text-blue-600 underline" target="_blank" rel="noreferrer">{ch.youtubeCode}</a></p>
              <p>🧪 Free Test: <a href={`https://testmoz.com/q/${ch.freetestCode}`} className="text-blue-600 underline" target="_blank" rel="noreferrer">{ch.freetestCode}</a></p>
              <p>🧪 Master Test: <a href={`https://testmoz.com/q/${ch.mastertestCode}`} className="text-blue-600 underline" target="_blank" rel="noreferrer">{ch.mastertestCode}</a></p>
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
        )}
      </div>
    </div>
  );
};

export default AdminUploadChapter;

