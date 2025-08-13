import { useEffect, useState, useMemo } from "react";
import api from "../../utils/axios";
import { Trash2, Eye, Search } from "lucide-react";
import AdminHeader from "../../components/Admin/AdminHeader";
import dayjs from "dayjs";

const AdminUploadMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    subject: "",
    chapter: "",
    type: "pdf",
    youtubeLink: "",
    downloadable: false,
    file: null,
  });

  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  const fetchMaterials = async () => {
    try {
      const res = await api.get("/materials");
      setMaterials(res.data?.data || []);
    } catch (err) {
      console.error("Fetch materials error:", err);
      setMaterials([]);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setUploadData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.subject || !uploadData.chapter) {
      alert("Title, subject and chapter are required");
      return;
    }

    if (uploadData.type !== "youtube" && !uploadData.file) {
      alert("Please upload a file for PDF/video");
      return;
    }

    if (uploadData.type === "youtube" && !uploadData.youtubeLink) {
      alert("Please enter a YouTube link");
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("subject", uploadData.subject);
    formData.append("chapter", uploadData.chapter);
    formData.append("type", uploadData.type);
    formData.append("downloadable", uploadData.downloadable);
    if (uploadData.type === "youtube") formData.append("youtubeLink", uploadData.youtubeLink);
    if (uploadData.file) formData.append("file", uploadData.file);

    try {
      setLoading(true);
      await api.post("/materials", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadData({ title: "", subject: "", chapter: "", type: "pdf", youtubeLink: "", downloadable: false, file: null });
      fetchMaterials();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await api.delete(`/materials/${id}`);
      fetchMaterials();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  const filteredMaterials = useMemo(() => {
    return [...materials]
      .filter((m) =>
        (m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.youtubeLink || "").toLowerCase().includes(searchQuery.toLowerCase())) &&
        (subjectFilter ? m.subject === subjectFilter : true)
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [materials, searchQuery, sortOrder, subjectFilter]);

  const subjects = [...new Set(materials.map((m) => m.subject))];

  // Badge color helper
  const typeBadgeColor = (type) => {
    if (type === "pdf") return "bg-blue-200 text-blue-800";
    if (type === "video") return "bg-green-200 text-green-800";
    if (type === "youtube") return "bg-red-200 text-red-800";
    return "bg-gray-200 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-100">
    
          <AdminHeader />
        

      <main className="max-w-5xl mx-auto p-4 mt-6">
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Study Material</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Course"
                value={uploadData.title}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={uploadData.subject}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="chapter"
                placeholder="Chapter"
                value={uploadData.chapter}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <select
                name="type"
                value={uploadData.type}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>

            {uploadData.type === "youtube" && (
              <input
                type="url"
                name="youtubeLink"
                placeholder="YouTube Link"
                value={uploadData.youtubeLink}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            )}
            {uploadData.type !== "youtube" && (
              <input
                type="file"
                name="file"
                accept="application/pdf,video/mp4"
                onChange={handleChange}
                className="w-full"
              />
            )}

            <div className="flex items-center gap-2">
              <input type="checkbox" name="downloadable" checked={uploadData.downloadable} onChange={handleChange} />
              <label>Downloadable</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, chapter or YouTube link"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border pl-8 p-2 rounded w-full"
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Materials Grid */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.length > 0 ? filteredMaterials.map((mat) => (
            <div key={mat._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${typeBadgeColor(mat.type)}`}>
                    {mat.type.toUpperCase()}
                  </span>
                  {mat.downloadable && (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-200 text-purple-800">
                      DOWNLOADABLE
                    </span>
                  )}
                </div>
                <p className="font-semibold text-lg mb-1">{mat.title}</p>
                <p className="text-sm text-gray-500 mb-1">{mat.subject} | {mat.chapter}</p>
                <p className="text-xs text-gray-400">Uploaded: {dayjs(mat.createdAt).format("DD MMM YYYY, HH:mm")}</p>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {mat.type !== "youtube" && (
                  <a
                    href={`${api.defaults.baseURL}/materials/${mat._id}/stream`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                  >
                    <Eye size={16} /> View
                  </a>
                )}
                {mat.downloadable && mat.type !== "youtube" && (
                  <a
                    href={`${api.defaults.baseURL}/materials/${mat._id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                  >
                    Download
                  </a>
                )}
                <button
                  onClick={() => handleDelete(mat._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          )) : (
            <p>No materials found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUploadMaterial;
