// src/pages/admin/AdminUploadMaterial.jsx
import { useState, useEffect } from "react";
import api from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";

// small helper to convert video url -> embed url (YouTube/Vimeo/shortcuts)
const getEmbedUrl = (url) => {
  if (!url) return "";
  try {
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo & other providers are returned as-is
    return url;
  } catch {
    return url;
  }
};

const Spinner = ({ size = 5 }) => (
  <svg
    className={`animate-spin inline-block w-${size} h-${size}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
  </svg>
);

const AdminUploadMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [type, setType] = useState("pdf");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Loading / UI states
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // Notifications
  const [notification, setNotification] = useState({ show: false, message: "", variant: "success" });

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    materialId: null,
    materialTitle: "",
  });

  // Viewer modal
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerMaterial, setViewerMaterial] = useState(null);

  // allowDownload toggle
  const [allowDownload, setAllowDownload] = useState(false);

  // fetch materials
  const fetchMaterials = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get("/materials");
      setMaterials(res.data || []);
    } catch (err) {
      showNotification("Failed to fetch materials. Try reloading.", "error");
      console.error("fetchMaterials error:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // notification helper
  const showNotification = (message, variant = "success", ms = 4500) => {
    setNotification({ show: true, message, variant });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), ms);
  };

  // start editing
  const startEdit = (material) => {
    setEditingId(material._id);
    setTitle(material.title || "");
    setSubject(material.subject || "");
    setCategory(material.category || "");
    // normalize tags to CSV string
    if (Array.isArray(material.tags)) setTags(material.tags.join(", "));
    else setTags(material.tags || "");
    setType(material.type || "pdf");
    setVideoUrl(material.type === "video" ? material.url || "" : "");
    setFile(null);
    setAllowDownload(Boolean(material.allowDownload));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // reset form
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSubject("");
    setCategory("");
    setTags("");
    setFile(null);
    setVideoUrl("");
    setType("pdf");
    setAllowDownload(false);
  };

  // submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const adminToken = localStorage.getItem("adminToken");
      const headers = {
        Authorization: `Bearer ${adminToken}`,
      };

      // basic validations
      if (!title.trim() || !subject.trim()) {
        showNotification("Title and subject are required.", "error");
        setSubmitLoading(false);
        return;
      }

      // prepare tags as you want backend to parse: we'll send CSV (backend supports JSON array or CSV)
      const tagsPayload = tags;

      if (editingId) {
        // update
        if (type === "pdf") {
          const formData = new FormData();
          formData.append("title", title.trim());
          formData.append("subject", subject.trim());
          formData.append("type", type);
          formData.append("category", category);
          formData.append("tags", tagsPayload);
          formData.append("allowDownload", allowDownload ? "true" : "false");
          // append file only if selected
          if (file) formData.append("pdf", file);

          await api.put(`/materials/${editingId}`, formData, {
            headers: { ...headers, "Content-Type": "multipart/form-data" },
          });
        } else {
          // video update (no file)
          await api.put(
            `/materials/${editingId}`,
            {
              title: title.trim(),
              subject: subject.trim(),
              type,
              category,
              tags: tagsPayload,
              url: videoUrl,
              allowDownload,
            },
            { headers }
          );
        }
        showNotification("Material updated successfully.", "success");
      } else {
        // create
        if (type === "pdf") {
          if (!file) {
            showNotification("Please choose a PDF to upload.", "error");
            setSubmitLoading(false);
            return;
          }

          const formData = new FormData();
          formData.append("title", title.trim());
          formData.append("subject", subject.trim());
          formData.append("type", type);
          formData.append("category", category);
          formData.append("tags", tagsPayload);
          formData.append("pdf", file);
          formData.append("allowDownload", allowDownload ? "true" : "false");

          await api.post("/materials/upload", formData, {
            headers: { ...headers, "Content-Type": "multipart/form-data" },
          });
        } else {
          // video create
          if (!videoUrl) {
            showNotification("Please enter a video URL.", "error");
            setSubmitLoading(false);
            return;
          }
          await api.post(
            "/materials/video",
            {
              title: title.trim(),
              subject: subject.trim(),
              type,
              category,
              tags: tagsPayload,
              url: videoUrl,
              allowDownload,
            },
            { headers }
          );
        }
        showNotification("Material uploaded successfully.", "success");
      }

      // refresh list and reset form
      await fetchMaterials();
      resetForm();
    } catch (err) {
      console.error("submit error:", err);
      const msg = err?.response?.data?.message || "Operation failed. Please try again.";
      showNotification(msg, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // delete flow
  const handleDeleteClick = (materialId, materialTitle) => {
    setDeleteConfirm({ isOpen: true, materialId, materialTitle });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, materialId: null, materialTitle: "" });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.materialId;
    if (!id) return;
    setDeleteLoadingId(id);

    try {
      const adminToken = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${adminToken}` };

      const res = await api.delete(`/materials/${id}`, { headers });
      if (res.data?.deleted) {
        showNotification("Material deleted successfully.", "success");
        await fetchMaterials();
      } else {
        showNotification("Failed to delete material.", "error");
      }
    } catch (err) {
      console.error("delete error:", err);
      showNotification(err?.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleteLoadingId(null);
      setDeleteConfirm({ isOpen: false, materialId: null, materialTitle: "" });
    }
  };

  // viewer open
  const openViewer = (material) => {
    setViewerMaterial(material);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setViewerMaterial(null);
  };

  // filtered materials
  const filteredMaterials = materials.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (m.title || "").toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q) ||
      (m.tags || []).join(", ").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      {/* Notification toast */}
      {notification.show && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all ${
            notification.variant === "success" ? "bg-green-50 border-l-4 border-green-500 text-green-700" : "bg-red-50 border-l-4 border-red-500 text-red-700"
          } px-5 py-3 rounded-md shadow`}
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold">{notification.variant === "success" ? "Success" : "Error"}</span>
            <span className="text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Upload Form */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">{editingId ? "Edit Material" : "Upload Study Material"}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pdf">📄 PDF Document</option>
                    <option value="video">🎥 Video Link</option>
                  </select>
                </label>

                <label className="block">
                  <input
                    placeholder="Title *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="block">
                  <input
                    placeholder="Subject *"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <input
                    placeholder="Category (Notes / Assignment / etc.)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="block">
                  <input
                    placeholder="Tags (comma separated or JSON array)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                {type === "pdf" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PDF File {editingId ? "(leave empty to keep current file)" : "*"}</label>
                    <label className="relative block cursor-pointer rounded-lg border-2 border-dashed border-blue-200 p-6 text-center hover:bg-blue-50 transition">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.9A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <div className="text-sm text-gray-700">{file ? file.name : "Click to select PDF"}</div>
                      </div>
                    </label>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      placeholder="Video URL * (YouTube / Vimeo / Drive)"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      required
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </label>
                )}

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">Allow users to download this file</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={submitLoading}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded font-medium text-white ${submitLoading ? "bg-indigo-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                {submitLoading ? <Spinner size={4} /> : null}
                <span>{editingId ? (submitLoading ? "Updating..." : "Update Material") : (submitLoading ? "Uploading..." : "Upload Material")}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Materials list */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex-1">
              <input
                placeholder="Search by title, subject or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="ml-4">
              <button onClick={fetchMaterials} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
                {fetchLoading ? <span className="inline-flex items-center gap-2"><Spinner size={4} /> Refresh</span> : "Refresh"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => {
              const downloadOrViewUrl = material.fullUrl || (material.url && (material.url.startsWith("http") ? material.url : `${import.meta.env.VITE_API_URL.replace("/api", "")}${material.url}`)) || "#";
              return (
                <div key={material._id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{material.title}</h3>
                      <p className="text-sm text-gray-600">{material.subject} · {material.category}</p>
                    </div>

                    <div className="text-xs">
                      <span className={`inline-flex items-center px-2 py-1 rounded ${material.type === "pdf" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                        {material.type === "pdf" ? "PDF" : "Video"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 mb-3">
                    {Array.isArray(material.tags) && material.tags.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-3 border-t">
                    <a
                      href={downloadOrViewUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex-1 text-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm"
                    >
                      {material.type === "pdf" ? "Open / Download" : "Open Video"}
                    </a>

                    <button onClick={() => startEdit(material)} className="px-3 py-2 text-indigo-600 hover:text-indigo-800">
                      Edit
                    </button>

                    <button onClick={() => openViewer(material)} className="px-3 py-2 text-sky-600 hover:text-sky-800">
                      View
                    </button>

                    <button
                      onClick={() => handleDeleteClick(material._id, material.title)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      {deleteLoadingId === material._id ? <span className="inline-flex items-center gap-2"><Spinner size={4}/> Deleting</span> : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* empty state */}
          {!fetchLoading && filteredMaterials.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No materials found</p>
              <p className="text-sm mt-2">Upload materials using the form above.</p>
            </div>
          )}
        </section>
      </main>

      {/* Delete Confirmation */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm delete</h3>
            <p className="mb-4">Are you sure you want to delete <strong>"{deleteConfirm.materialTitle}"</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={handleDeleteCancel} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded">
                {deleteLoadingId ? <span className="inline-flex items-center gap-2"><Spinner size={4}/> Deleting...</span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewer Modal (protected preview) */}
      {viewerOpen && viewerMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div id="admin-protected-root" className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{viewerMaterial.title}</h3>
                <p className="text-sm text-gray-600">{viewerMaterial.subject} · {viewerMaterial.category}</p>
              </div>

              <div className="flex items-center gap-2">
                {viewerMaterial.allowDownload ? (
                  <a
                    href={viewerMaterial.fullUrl || viewerMaterial.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  >
                    Open / Download
                  </a>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Protected (no download)</span>
                )}
                <button onClick={closeViewer} className="px-3 py-1 border rounded text-sm">Close</button>
              </div>
            </div>

            <div
              className="p-4 overflow-auto protected-content"
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                WebkitTouchCallout: "none",
              }}
            >
              {viewerMaterial.type === "pdf" ? (
                // use fullUrl if available
                <iframe
                  title={viewerMaterial.title}
                  src={viewerMaterial.fullUrl || viewerMaterial.url}
                  className="w-full h-[70vh] border rounded"
                  sandbox="allow-same-origin allow-forms"
                />
              ) : (
                <div className="w-full h-[70vh]">
                  <iframe
                    title={viewerMaterial.title}
                    src={getEmbedUrl(viewerMaterial.fullUrl || viewerMaterial.url)}
                    className="w-full h-full rounded"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploadMaterial;
