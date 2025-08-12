import React, { useState, useEffect } from "react";

const AdminUploadMaterial = ({ materialId }) => {
  // States for metadata
  const [courseName, setCourseName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [allowDownload, setAllowDownload] = useState(false);

  // Files & YouTube links states
  const [existingFiles, setExistingFiles] = useState([]);
  const [existingYouTubeLinks, setExistingYouTubeLinks] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newYouTubeInput, setNewYouTubeInput] = useState("");
  const [newYouTubeLinks, setNewYouTubeLinks] = useState([]);

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!materialId) return;

    setLoading(true);
    fetch(`/api/materials/${materialId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.material) {
          const m = data.material;
          setCourseName(m.courseName || "");
          setSubjectName(m.subjectName || "");
          setTopicName(m.topicName || "");
          setExistingFiles(m.files || []);
          setExistingYouTubeLinks(m.youtubeLinks || []);
          setAllowDownload(false);
        } else {
          setError(data.error || "Failed to load material");
        }
      })
      .catch(() => setError("Failed to load material"))
      .finally(() => setLoading(false));
  }, [materialId]);

  const handleNewFilesChange = (e) => {
    setNewFiles([...newFiles, ...Array.from(e.target.files)]);
  };
  const removeNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const addNewYouTubeLink = () => {
    if (!newYouTubeInput.trim()) return;
    setNewYouTubeLinks([...newYouTubeLinks, newYouTubeInput.trim()]);
    setNewYouTubeInput("");
  };
  const removeNewYouTubeLink = (index) => {
    setNewYouTubeLinks(newYouTubeLinks.filter((_, i) => i !== index));
  };

  const deleteExistingFile = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/materials/${materialId}/file/${fileId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setExistingFiles(existingFiles.filter((f) => f._id !== fileId));
        setMessage("File deleted");
      } else {
        setError(data.error || "Failed to delete file");
      }
    } catch {
      setError("Failed to delete file");
    } finally {
      setLoading(false);
    }
  };

  const replaceExistingFile = async (fileId, file) => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("allowDownload", allowDownload.toString());

      const res = await fetch(`/api/materials/${materialId}/file/${fileId}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setExistingFiles((files) =>
          files.map((f) => (f._id === fileId ? data.material.files.find((nf) => nf._id === fileId) : f))
        );
        setMessage("File replaced");
      } else {
        setError(data.error || "Failed to replace file");
      }
    } catch {
      setError("Failed to replace file");
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingYouTubeLink = async (index) => {
    if (!window.confirm("Delete this YouTube link?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/materials/${materialId}/youtube/${index}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setExistingYouTubeLinks(existingYouTubeLinks.filter((_, i) => i !== index));
        setMessage("YouTube link deleted");
      } else {
        setError(data.error || "Failed to delete YouTube link");
      }
    } catch {
      setError("Failed to delete YouTube link");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("courseName", courseName);
      formData.append("subjectName", subjectName);
      formData.append("topicName", topicName);
      formData.append("allowDownload", allowDownload.toString());

      newFiles.forEach((file) => formData.append("files", file));
      newYouTubeLinks.forEach((link) => formData.append("youtubeLinks", link));

      if (materialId) {
        formData.append("materialId", materialId);
      }

      const res = await fetch("/api/materials/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessage(materialId ? "Material updated" : "Material uploaded");
        setExistingFiles(data.material.files || []);
        setExistingYouTubeLinks(data.material.youtubeLinks || []);
        setNewFiles([]);
        setNewYouTubeLinks([]);
        setNewYouTubeInput("");
      } else {
        setError(data.error || "Failed to upload material");
      }
    } catch {
      setError("Failed to upload material");
    } finally {
      setLoading(false);
    }
  };

  // Styles as JS objects:
  const containerStyle = {
    maxWidth: 700,
    margin: "2rem auto",
    padding: "1rem 1.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };
  const headingStyle = {
    marginBottom: "1rem",
    color: "#1f2937",
  };
  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  };
  const labelStyle = {
    fontWeight: 600,
    color: "#374151",
    display: "block",
    marginBottom: "0.4rem",
  };
  const inputStyle = {
    width: "100%",
    padding: "0.4rem 0.6rem",
    border: "1.5px solid #d1d5db",
    borderRadius: 5,
    fontSize: "1rem",
    outlineOffset: 2,
  };
  const inputFocusStyle = {
    borderColor: "#2563eb",
    outline: "none",
  };
  const checkboxLabelStyle = {
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };
  const sectionStyle = {
    marginTop: "1rem",
    paddingTop: "0.8rem",
    borderTop: "1px solid #e5e7eb",
  };
  const fileListStyle = {
    listStyle: "none",
    paddingLeft: 0,
    marginTop: "0.6rem",
  };
  const fileItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: "0.5rem 1rem",
    borderRadius: 5,
    boxShadow: "0 0 4px rgba(0,0,0,0.05)",
    marginBottom: "0.5rem",
  };
  const btnStyle = {
    cursor: "pointer",
    border: "none",
    padding: "0.3rem 0.8rem",
    borderRadius: 4,
    fontSize: "0.9rem",
    marginLeft: 8,
    transition: "background-color 0.2s ease",
  };
  const btnDanger = {
    ...btnStyle,
    backgroundColor: "#dc2626",
    color: "white",
  };
  const btnDangerHover = {
    backgroundColor: "#b91c1c",
  };
  const btnPrimary = {
    ...btnStyle,
    backgroundColor: "#2563eb",
    color: "white",
  };
  const btnPrimaryHover = {
    backgroundColor: "#1e40af",
  };
  const btnLink = {
    background: "none",
    color: "#2563eb",
    padding: 0,
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
  };
  const btnSubmit = {
    backgroundColor: "#16a34a",
    color: "white",
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    borderRadius: 6,
    transition: "background-color 0.3s ease",
    marginTop: "1rem",
  };
  const infoStyle = {
    color: "#2563eb",
    fontWeight: 600,
  };
  const successStyle = {
    color: "#16a34a",
    fontWeight: 600,
  };
  const errorStyle = {
    color: "#dc2626",
    fontWeight: 600,
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>{materialId ? "Edit Study Material" : "Upload Study Material"}</h2>

      {loading && <p style={infoStyle}>Loading...</p>}
      {message && <p style={successStyle}>{message}</p>}
      {error && <p style={errorStyle}>{error}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={labelStyle}>
            Course Name:
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
        </div>

        <div>
          <label style={labelStyle}>
            Subject Name:
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
        </div>

        <div>
          <label style={labelStyle}>
            Topic Name:
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              required
              style={inputStyle}
            />
          </label>
        </div>

        <div style={{ marginTop: 8 }}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={allowDownload}
              onChange={() => setAllowDownload((prev) => !prev)}
            />
            Allow Download for New Files
          </label>
        </div>

        {existingFiles.length > 0 && (
          <div style={sectionStyle}>
            <h3>Existing Files</h3>
            <ul style={fileListStyle}>
              {existingFiles.map((file) => (
                <li key={file._id} style={fileItemStyle}>
                  <div>
                    <strong>{file.fileName}</strong> ({file.mimeType}) -{" "}
                    {file.allowDownload ? "Download allowed" : "No download"}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => deleteExistingFile(file._id)}
                      disabled={loading}
                      style={btnDanger}
                    >
                      Delete
                    </button>
                    <label style={{ ...btnLink, marginLeft: 8, cursor: loading ? "default" : "pointer" }}>
                      Replace
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => replaceExistingFile(file._id, e.target.files[0])}
                        disabled={loading}
                      />
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {existingYouTubeLinks.length > 0 && (
          <div style={sectionStyle}>
            <h3>Existing YouTube Links</h3>
            <ul style={fileListStyle}>
              {existingYouTubeLinks.map((link, i) => (
                <li key={i} style={fileItemStyle}>
                  <a href={link} target="_blank" rel="noreferrer">
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => deleteExistingYouTubeLink(i)}
                    disabled={loading}
                    style={btnDanger}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={sectionStyle}>
          <h3>Add New Files</h3>
          <input
            type="file"
            multiple
            onChange={handleNewFilesChange}
            disabled={loading}
            style={inputStyle}
          />
          {newFiles.length > 0 && (
            <ul style={fileListStyle}>
              {newFiles.map((file, i) => (
                <li key={i} style={fileItemStyle}>
                  {file.name} ({Math.round(file.size / 1024)} KB)
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    disabled={loading}
                    style={btnDanger}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={sectionStyle}>
          <h3>Add New YouTube Links</h3>
          <input
            type="text"
            placeholder="Paste YouTube link"
            value={newYouTubeInput}
            onChange={(e) => setNewYouTubeInput(e.target.value)}
            disabled={loading}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={addNewYouTubeLink}
            disabled={loading || !newYouTubeInput.trim()}
            style={btnPrimary}
          >
            Add Link
          </button>
          {newYouTubeLinks.length > 0 && (
            <ul style={fileListStyle}>
              {newYouTubeLinks.map((link, i) => (
                <li key={i} style={fileItemStyle}>
                  <a href={link} target="_blank" rel="noreferrer">
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeNewYouTubeLink(i)}
                    disabled={loading}
                    style={btnDanger}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={btnSubmit}
        >
          {materialId ? "Update Material" : "Upload Material"}
        </button>
      </form>
    </div>
  );
};

export default AdminUploadMaterial;
