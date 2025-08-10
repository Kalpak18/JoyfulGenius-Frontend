// // src/pages/admin/AdminUploadMaterial.jsx

// import { useEffect, useState } from "react";
// import api from "../../utils/axios";
// import AdminHeader from "../../components/Admin/AdminHeader";

// const AdminUploadMaterial = () => {
//   const [materials, setMaterials] = useState([]);
//   const [type, setType] = useState("pdf");
//   const [title, setTitle] = useState("");
//   const [subject, setSubject] = useState("");
//   const [category, setCategory] = useState("");
//   const [tags, setTags] = useState("");
//   const [file, setFile] = useState(null);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [search, setSearch] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [message, setMessage] = useState("");
//   const [notification, setNotification] = useState({ show: false, message: "", type: "" });

//   const fetchMaterials = async () => {
//     const res = await api.get("/materials");
//     setMaterials(res.data);
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const showNotification = (message, type = "success") => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ ...notification, show: false }), 5000);
//   };


//     const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const headers = {
//       Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//     };
    

//     if (editingId) {
//       // Update existing material
//       if (type === "pdf") {
//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("subject", subject);
//         formData.append("type", type);
//         formData.append("category", category);
//         formData.append("tags", tags);
//         if (file) {
//           formData.append("pdf", file);
//         }
//         headers["Content-Type"] = "multipart/form-data";
//         await api.put(`/materials/${editingId}`, formData, { headers });
//       } else {
//         await api.put(
//           `/materials/${editingId}`,
//           { title, subject, type, category, tags, url: videoUrl },
//           { headers }
//         );
//       }
//       showNotification("Material updated successfully!");
//       setEditingId(null);
//     } else {
//       // Create new material
//       if (type === "pdf") {
//         if (!file) {
//           showNotification("Please select a PDF file", "error");
//           return;
//         }
//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("subject", subject);
//         formData.append("type", type);
//         formData.append("category", category);
//         formData.append("tags", tags);
//         formData.append("pdf", file);
//         headers["Content-Type"] = "multipart/form-data";
//         await api.post("/materials/upload", formData, { headers });
//       } else {
//         if (!videoUrl) {
//           showNotification("Please enter a video URL", "error");
//           return;
//         }
//         await api.post(
//           "/materials/video",
//           { title, subject, type, category, tags, url: videoUrl },
//           { headers }
//         );
//       }
//       showNotification("Material uploaded successfully!");
//     }

//     // Reset form
//     setTitle("");
//     setSubject("");
//     setCategory("");
//     setTags("");
//     setFile(null);
//     setVideoUrl("");
//     fetchMaterials();
//   } catch (err) {
//     console.error("Submission error:", err);
//     showNotification(
//       err.response?.data?.message || "Operation failed. Please try again.",
//       "error"
//     );
//   }
// };

//   //  const handleDelete = async (id) => {
//   //   if (window.confirm("Are you sure you want to delete this material?")) {
//   //     try {
//   //       await api.delete(`/materials/${id}`, {
//   //         headers: {
//   //           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//   //         },
//   //       });
//   //       showNotification("Material deleted successfully!");
//   //       fetchMaterials();
//   //     } catch (err) {
//   //       showNotification("Failed to delete material.", "error");
//   //     }
//   //   }
//   // };
  
  
//   const handleDelete = async (id) => {
//   try {
//     // Custom confirmation dialog
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this material? This action cannot be undone."
//     );
    
//     if (!confirmDelete) return;

//     const response = await api.delete(`/materials/${id}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//       },
//     });

//     if (response.data.deleted) {
//       showNotification("Material deleted successfully!");
//       fetchMaterials();
//     } else {
//       showNotification("Failed to delete material.", "error");
//     }
//   } catch (err) {
//     showNotification(
//       err.response?.data?.message || "Delete failed. Please try again.",
//       "error"
//     );
//   }
// };

//   const filteredMaterials = materials.filter(
//     (m) =>
//       m.title.toLowerCase().includes(search.toLowerCase()) ||
//       m.subject.toLowerCase().includes(search.toLowerCase())
//   );


// return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Sticky Notification */}
//       {notification.show && (
//         <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
//           notification.type === "error" 
//             ? "bg-red-100 border-l-4 border-red-500 text-red-700" 
//             : "bg-green-100 border-l-4 border-green-500 text-green-700"
//         }`}>
//           <div className="flex items-center">
//             <span className="mr-2">
//               {notification.type === "error" ? "❌" : "✅"}
//             </span>
//             <span>{notification.message}</span>
//           </div>
//         </div>
//       )}

//       <AdminHeader />
      
//       <main className="max-w-6xl mx-auto p-4 md:p-6">
//         {/* Upload Section */}
//         <section className="bg-white rounded-xl shadow-md p-6 mb-8">
//           <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
//             {editingId ? "✏️ Edit Material" : "📤 Upload Study Material"}
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
            // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            //   <div className="space-y-4">
            //     <select
            //       value={type}
            //       onChange={(e) => setType(e.target.value)}
            //       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            //     >
            //       <option value="pdf">📄 PDF Document</option>
            //       <option value="video">🎥 Video Link</option>
            //     </select>

            //     <input
            //       type="text"
            //       placeholder="Title*"
            //       value={title}
            //       onChange={(e) => setTitle(e.target.value)}
            //       required
            //       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            //     />

            //     <input
            //       type="text"
            //       placeholder="Subject*"
            //       value={subject}
            //       onChange={(e) => setSubject(e.target.value)}
            //       required
            //       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            //     />
            //   </div>

            //   <div className="space-y-4">
            //     <input
            //       type="text"
            //       placeholder="Category (e.g., Notes, Assignment)"
            //       value={category}
            //       onChange={(e) => setCategory(e.target.value)}
            //       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            //     />

            //     <input
            //       type="text"
            //       placeholder="Tags (comma separated)"
            //       value={tags}
            //       onChange={(e) => setTags(e.target.value)}
            //       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            //     />

            //     {type === "pdf" ? (
            //       <div className="file-upload">
            //         <label className="block text-sm font-medium text-gray-700 mb-1">
            //           PDF File {!editingId && "*"}
            //         </label>
            //         <div className="flex items-center">
            //           <label className="flex flex-col items-center justify-center px-4 py-10 bg-white text-blue-500 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 w-full transition duration-200">
            //             <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            //             </svg>
            //             <span className="text-sm">
            //               {file ? file.name : "Click to upload PDF"}
            //             </span>
            //             <input
            //               type="file"
            //               accept="application/pdf"
            //               onChange={(e) => setFile(e.target.files[0])}
            //               required={!editingId}
            //               className="hidden"
            //             />
            //           </label>
            //         </div>
            //       </div>
            //     ) : (
            //       <input
            //         type="url"
            //         placeholder="Video URL* (YouTube, Vimeo, etc.)"
            //         value={videoUrl}
            //         onChange={(e) => setVideoUrl(e.target.value)}
            //         required
            //         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            //       />
            //     )}
            //   </div>
            // </div>

            // <div className="flex justify-end mt-6">
            //   {editingId && (
            //     <button
            //       type="button"
            //       onClick={() => {
            //         setEditingId(null);
            //         setTitle("");
            //         setSubject("");
            //         setCategory("");
            //         setTags("");
            //         setFile(null);
            //         setVideoUrl("");
            //       }}
            //       className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
            //     >
            //       Cancel
            //     </button>
            //   )}
            //   <button
            //     type="submit"
            //     className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium shadow hover:shadow-md"
            //   >
            //     {editingId ? "Update Material" : "Upload Material"}
            //   </button>
            // </div>
//           </form>
//         </section>

//         {/* Materials List Section */}
//         <section className="bg-white rounded-xl shadow-md p-6">
//           <div className="mb-6">
//             <input
//               type="text"
//               placeholder="🔍 Search by title or subject..."
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredMaterials.map((material) => (
//               <div
//                 key={material._id}
//                 className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white flex flex-col"
//               >
                // <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                //   {material.title}
                // </h3>
                // <p className="text-sm text-gray-600 mb-2">
                //   📚 {material.subject}
                // </p>
                
                // <div className="flex flex-wrap gap-1 mb-3">
                //   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                //     material.type === "pdf" 
                //       ? "bg-blue-100 text-blue-800" 
                //       : "bg-purple-100 text-purple-800"
                //   }`}>
                //     {material.type === "pdf" ? "📄 PDF" : "🎥 Video"}
                //   </span>
                  
                //   {material.category && (
                //     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                //       🏷️ {material.category}
                //     </span>
                //   )}
                // </div>

                // {material.tags?.length > 0 && (
                //   <div className="flex flex-wrap gap-1 mb-3">
                //     {material.tags.map((tag, i) => (
                //       <span
                //         key={i}
                //         className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                //       >
                //         {tag}
                //       </span>
                //     ))}
                //   </div>
                // )}

                // <div className="mt-auto pt-3 border-t border-gray-100">
                //   <a
                //     href={
                //       material.type === "pdf"
                //         ? `http://localhost:5000${material.url}`
                //         : material.url
                //     }
                //     target="_blank"
                //     rel="noopener noreferrer"
                //     className="block text-center bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200 mb-3"
                //   >
                //     {material.type === "pdf" ? "📥 Download PDF" : "🎬 Watch Video"}
                //   </a>

//                   <div className="flex justify-between text-sm">
//                     <button
//                       onClick={() => {
//                         setEditingId(material._id);
//                         setTitle(material.title);
//                         setSubject(material.subject);
//                         setCategory(material.category || "");
//                         setTags(material.tags?.join(", ") || "");
//                         setType(material.type);
//                         if (material.type === "pdf") {
//                           setFile(null);
//                         } else {
//                           setVideoUrl(material.url);
//                         }
//                         window.scrollTo({ top: 0, behavior: "smooth" });
//                       }}
//                       className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
//                     >
//                       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
//                       </svg>
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(material._id)}
//                       className="text-red-600 hover:text-red-800 font-medium flex items-center"
//                     >
//                       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//                       </svg>
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default AdminUploadMaterial;



// import { useState, useEffect } from "react";
// import api from "../../utils/axios";
// import AdminHeader from "../../components/Admin/AdminHeader";

// const AdminUploadMaterial = () => {
//   const [materials, setMaterials] = useState([]);
//   const [type, setType] = useState("pdf");
//   const [title, setTitle] = useState("");
//   const [subject, setSubject] = useState("");
//   const [category, setCategory] = useState("");
//   const [tags, setTags] = useState("");
//   const [file, setFile] = useState(null);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [search, setSearch] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [notification, setNotification] = useState({ show: false, message: "", type: "" });
//   const [deleteConfirm, setDeleteConfirm] = useState({
//     isOpen: false,
//     materialId: null,
//     materialTitle: ""
//   });

//   // Fetch materials
//   const fetchMaterials = async () => {
//     try {
//       const res = await api.get("/materials");
//       setMaterials(res.data);
//     } catch (err) {
//       showNotification("Failed to fetch materials", "error");
//     }
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   // Notification handler
//   const showNotification = (message, type = "success") => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ ...notification, show: false }), 5000);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const headers = {
//         Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//       };

//       if (editingId) {
//         // Update existing material
//         if (type === "pdf") {
//           const formData = new FormData();
//           formData.append("title", title);
//           formData.append("subject", subject);
//           formData.append("type", type);
//           formData.append("category", category);
//           formData.append("tags", tags);
//           if (file) {
//             formData.append("pdf", file);
//           }
//           headers["Content-Type"] = "multipart/form-data";
//           await api.put(`/materials/${editingId}`, formData, { headers });
//         } else {
//           await api.put(
//             `/materials/${editingId}`,
//             { title, subject, type, category, tags, url: videoUrl },
//             { headers }
//           );
//         }
//         showNotification("Material updated successfully!");
//         setEditingId(null);
//       } else {
//         // Create new material
//         if (type === "pdf") {
//           if (!file) {
//             showNotification("Please select a PDF file", "error");
//             return;
//           }
//           const formData = new FormData();
//           formData.append("title", title);
//           formData.append("subject", subject);
//           formData.append("type", type);
//           formData.append("category", category);
//           formData.append("tags", tags);
//           formData.append("pdf", file);
//           headers["Content-Type"] = "multipart/form-data";
//           await api.post("/materials/upload", formData, { headers });
//         } else {
//           if (!videoUrl) {
//             showNotification("Please enter a video URL", "error");
//             return;
//           }
//           await api.post(
//             "/materials/video",
//             { title, subject, type, category, tags, url: videoUrl },
//             { headers }
//           );
//         }
//         showNotification("Material uploaded successfully!");
//       }

//       // Reset form
//       setTitle("");
//       setSubject("");
//       setCategory("");
//       setTags("");
//       setFile(null);
//       setVideoUrl("");
//       fetchMaterials();
//     } catch (err) {
//       console.error("Submission error:", err);
//       showNotification(
//         err.response?.data?.message || "Operation failed. Please try again.",
//         "error"
//       );
//     }
//   };

//   // Delete confirmation handlers
//   const handleDeleteClick = (materialId, materialTitle) => {
//     setDeleteConfirm({
//       isOpen: true,
//       materialId,
//       materialTitle
//     });
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       const { materialId } = deleteConfirm;
//       const response = await api.delete(`/materials/${materialId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
//         },
//       });

//       if (response.data.deleted) {
//         showNotification("Material deleted successfully!");
//         fetchMaterials();
//       } else {
//         showNotification("Failed to delete material.", "error");
//       }
//     } catch (err) {
//       showNotification(
//         err.response?.data?.message || "Delete failed. Please try again.",
//         "error"
//       );
//     } finally {
//       setDeleteConfirm({ isOpen: false, materialId: null, materialTitle: "" });
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteConfirm({ isOpen: false, materialId: null, materialTitle: "" });
//   };

//   const filteredMaterials = materials.filter(
//     (m) =>
//       m.title.toLowerCase().includes(search.toLowerCase()) ||
//       m.subject.toLowerCase().includes(search.toLowerCase())
//   );

//   // Confirmation Dialog Component
//   const ConfirmationDialog = () => {
//     if (!deleteConfirm.isOpen) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
//           <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
//           <p className="mb-4">
//             Are you sure you want to delete <strong>"{deleteConfirm.materialTitle}"</strong>? 
//             This action cannot be undone.
//           </p>
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={handleDeleteCancel}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeleteConfirm}
//               className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Sticky Notification */}
//       {notification.show && (
//         <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
//           notification.type === "error" 
//             ? "bg-red-100 border-l-4 border-red-500 text-red-700" 
//             : "bg-green-100 border-l-4 border-green-500 text-green-700"
//         }`}>
//           <div className="flex items-center">
//             <span className="mr-2">
//               {notification.type === "error" ? "❌" : "✅"}
//             </span>
//             <span>{notification.message}</span>
//           </div>
//         </div>
//       )}

//       <AdminHeader />
      
//       <main className="max-w-6xl mx-auto p-4 md:p-6">
//         {/* Upload Section */}
//         <section className="bg-white rounded-xl shadow-md p-6 mb-8">
//           <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
//             {editingId ? "✏️ Edit Material" : "📤 Upload Study Material"}
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* ... (rest of your form JSX remains exactly the same) ... */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <select
//                   value={type}
//                   onChange={(e) => setType(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="pdf">📄 PDF Document</option>
//                   <option value="video">🎥 Video Link</option>
//                 </select>

//                 <input
//                   type="text"
//                   placeholder="Title*"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 />

//                 <input
//                   type="text"
//                   placeholder="Subject*"
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Category (e.g., Notes, Assignment)"
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 />

//                 <input
//                   type="text"
//                   placeholder="Tags (comma separated)"
//                   value={tags}
//                   onChange={(e) => setTags(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 />

//                 {type === "pdf" ? (
//                   <div className="file-upload">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       PDF File {!editingId && "*"}
//                     </label>
//                     <div className="flex items-center">
//                       <label className="flex flex-col items-center justify-center px-4 py-10 bg-white text-blue-500 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 w-full transition duration-200">
//                         <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
//                         </svg>
//                         <span className="text-sm">
//                           {file ? file.name : "Click to upload PDF"}
//                         </span>
//                         <input
//                           type="file"
//                           accept="application/pdf"
//                           onChange={(e) => setFile(e.target.files[0])}
//                           required={!editingId}
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
//                   </div>
//                 ) : (
//                   <input
//                     type="url"
//                     placeholder="Video URL* (YouTube, Vimeo, etc.)"
//                     value={videoUrl}
//                     onChange={(e) => setVideoUrl(e.target.value)}
//                     required
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                   />
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end mt-6">
//               {editingId && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setEditingId(null);
//                     setTitle("");
//                     setSubject("");
//                     setCategory("");
//                     setTags("");
//                     setFile(null);
//                     setVideoUrl("");
//                   }}
//                   className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
//                 >
//                   Cancel
//                 </button>
//               )}
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium shadow hover:shadow-md"
//               >
//                 {editingId ? "Update Material" : "Upload Material"}
//               </button>
//             </div>
//           </form>
//         </section>

//         {/* Materials List Section */}
//         <section className="bg-white rounded-xl shadow-md p-6">
//           <div className="mb-6">
//             <input
//               type="text"
//               placeholder="🔍 Search by title or subject..."
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredMaterials.map((material) => (
//               <div
//                 key={material._id}
//                 className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white flex flex-col"
//               >
//                 {/* ... (rest of your material card JSX) ... */}
//                  <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
//                   {material.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-2">
//                   📚 {material.subject}
//                 </p>
                
//                 <div className="flex flex-wrap gap-1 mb-3">
//                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     material.type === "pdf" 
//                       ? "bg-blue-100 text-blue-800" 
//                       : "bg-purple-100 text-purple-800"
//                   }`}>
//                     {material.type === "pdf" ? "📄 PDF" : "🎥 Video"}
//                   </span>
                  
//                   {material.category && (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                       🏷️ {material.category}
//                     </span>
//                   )}
//                 </div>

//                 {material.tags?.length > 0 && (
//                   <div className="flex flex-wrap gap-1 mb-3">
//                     {material.tags.map((tag, i) => (
//                       <span
//                         key={i}
//                         className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 <div className="mt-auto pt-3 border-t border-gray-100">
//                   <a
//                     href={
//                       material.type === "pdf"
//                         ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${material.url}`
//                         : material.url
//                     }
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block text-center bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200 mb-3"
//                   >
//                     {material.type === "pdf" ? "📥 Download PDF" : "🎬 Watch Video"}
//                   </a>


//                 <div className="flex justify-between text-sm">
//                   <button
//                     onClick={() => {
//                       setEditingId(material._id);
//                       setTitle(material.title);
//                       setSubject(material.subject);
//                       setCategory(material.category || "");
//                       setTags(material.tags?.join(", ") || "");
//                       setType(material.type);
//                       if (material.type === "pdf") {
//                         setFile(null);
//                       } else {
//                         setVideoUrl(material.url);
//                       }
//                       window.scrollTo({ top: 0, behavior: "smooth" });
//                     }}
//                     className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
//                   >
//                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
//                     </svg>
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleDeleteClick(material._id, material.title)}
//                     className="text-red-600 hover:text-red-800 font-medium flex items-center"
//                   >
//                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//                     </svg>
//                     Delete
//                   </button>
//                 </div>
//               </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>

//       {/* Confirmation Dialog */}
//       <ConfirmationDialog />
//     </div>
//   );
// };

// export default AdminUploadMaterial;


// src/pages/admin/AdminUploadMaterial.jsx
import { useState, useEffect } from "react";
import api from "../../utils/axios";
import AdminHeader from "../../components/Admin/AdminHeader";

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
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    materialId: null,
    materialTitle: ""
  });

  // NEW: allowDownload toggle
  const [allowDownload, setAllowDownload] = useState(false);

  // NEW: viewer modal state (protected preview)
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerMaterial, setViewerMaterial] = useState(null);

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      const res = await api.get("/materials");
      setMaterials(res.data);
    } catch (err) {
      showNotification("Failed to fetch materials", "error");
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Notification handler
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 5000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      };

      // Ensure tags are passed as string (keep your existing format)
      // If you prefer comma-separated -> JSON, you can transform here.
      // const tagsPayload = JSON.stringify(tags.split(",").map(t => t.trim()).filter(Boolean));

      if (editingId) {
        // Update existing material
        if (type === "pdf") {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("subject", subject);
          formData.append("type", type);
          formData.append("category", category);
          formData.append("tags", tags);
          // append allowDownload as string — backend should coerce to boolean.
          formData.append("allowDownload", allowDownload ? "true" : "false");
          if (file) {
            formData.append("pdf", file);
          }
          headers["Content-Type"] = "multipart/form-data";
          await api.put(`/materials/${editingId}`, formData, { headers });
        } else {
          await api.put(
            `/materials/${editingId}`,
            { title, subject, type, category, tags, url: videoUrl, allowDownload },
            { headers }
          );
        }
        showNotification("Material updated successfully!");
        setEditingId(null);
      } else {
        // Create new material
        if (type === "pdf") {
          if (!file) {
            showNotification("Please select a PDF file", "error");
            return;
          }
          const formData = new FormData();
          formData.append("title", title);
          formData.append("subject", subject);
          formData.append("type", type);
          formData.append("category", category);
          formData.append("tags", tags);
          formData.append("pdf", file);
          formData.append("allowDownload", allowDownload ? "true" : "false");
          headers["Content-Type"] = "multipart/form-data";
          await api.post("/materials/upload", formData, { headers });
        } else {
          if (!videoUrl) {
            showNotification("Please enter a video URL", "error");
            return;
          }
          await api.post(
            "/materials/video",
            { title, subject, type, category, tags, url: videoUrl, allowDownload },
            { headers }
          );
        }
        showNotification("Material uploaded successfully!");
      }

      // Reset form
      setTitle("");
      setSubject("");
      setCategory("");
      setTags("");
      setFile(null);
      setVideoUrl("");
      setAllowDownload(false);
      fetchMaterials();
    } catch (err) {
      console.error("Submission error:", err);
      showNotification(
        err.response?.data?.message || "Operation failed. Please try again.",
        "error"
      );
    }
  };

  // Delete confirmation handlers
  const handleDeleteClick = (materialId, materialTitle) => {
    setDeleteConfirm({
      isOpen: true,
      materialId,
      materialTitle
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const { materialId } = deleteConfirm;
      const response = await api.delete(`/materials/${materialId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.data.deleted) {
        showNotification("Material deleted successfully!");
        fetchMaterials();
      } else {
        showNotification("Failed to delete material.", "error");
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Delete failed. Please try again.",
        "error"
      );
    } finally {
      setDeleteConfirm({ isOpen: false, materialId: null, materialTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, materialId: null, materialTitle: "" });
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  // Confirmation Dialog Component
  const ConfirmationDialog = () => {
    if (!deleteConfirm.isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
          <p className="mb-4">
            Are you sure you want to delete <strong>"{deleteConfirm.materialTitle}"</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -----------------------
  // VIEWER (protected preview)
  // -----------------------
  const openViewer = (material) => {
    setViewerMaterial(material);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setViewerMaterial(null);
  };

  // Effect: when viewer opens, attach protection listeners; remove on close
  useEffect(() => {
    if (!viewerOpen) return;

    const preventAction = (e) => {
      e.preventDefault();
      // optional: small visual hint instead of alert for better UX
    };

    const handleKeyDown = (e) => {
      // block common copy / view-source / devtools shortcuts and PrintScreen
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "x" || e.key === "v" || e.key === "s" || e.key === "u")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
      }
    };

    const handleSelection = () => {
      // attempt to clear selection
      if (window.getSelection) window.getSelection().removeAllRanges();
    };

    // Block clipboard events
    document.addEventListener("copy", preventAction);
    document.addEventListener("cut", preventAction);
    document.addEventListener("paste", preventAction);

    // Block context menu
    document.addEventListener("contextmenu", preventAction);

    // Block keyboard shortcuts
    document.addEventListener("keydown", handleKeyDown);

    // Clear selection if it occurs
    document.addEventListener("selectionchange", handleSelection);

    // Visibility change: hide protected content when tab not visible (best-effort)
    const handleVisibilityChange = () => {
      const root = document.getElementById("admin-protected-root");
      if (!root) return;
      if (document.hidden) {
        root.classList.add("protected-hidden");
      } else {
        root.classList.remove("protected-hidden");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add CSS rules to head to disable selection & touch-callout inside .protected-content
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-protect-style", "true");
    styleEl.innerHTML = `
      /* disable selection and touch-callout in protected content */
      .protected-content, .protected-content * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      /* hide when backgrounded */
      .protected-hidden .protected-content { visibility: hidden !important; opacity: 0 !important; }
      /* make sure iframe doesn't allow pointer selection tricks */
      .protected-content iframe { pointer-events: none; }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("cut", preventAction);
      document.removeEventListener("paste", preventAction);
      document.removeEventListener("contextmenu", preventAction);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectionchange", handleSelection);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      const el = document.querySelector('style[data-protect-style="true"]');
      if (el) el.remove();
      // remove protected-hidden class if left behind
      const root = document.getElementById("admin-protected-root");
      if (root) root.classList.remove("protected-hidden");
    };
  }, [viewerOpen]);

  // Helper to set editing values
  const startEdit = (material) => {
    setEditingId(material._id);
    setTitle(material.title);
    setSubject(material.subject);
    setCategory(material.category || "");
    setTags(material.tags?.join(", ") || material.tags || "");
    setType(material.type);
    setVideoUrl(material.type === "video" ? material.url : "");
    setFile(null);
    // NEW: populate allowDownload toggle
    setAllowDownload(Boolean(material.allowDownload));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Notification */}
      {notification.show && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === "error" 
            ? "bg-red-100 border-l-4 border-red-500 text-red-700" 
            : "bg-green-100 border-l-4 border-green-500 text-green-700"
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === "error" ? "❌" : "✅"}
            </span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <AdminHeader />
      
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Upload Section */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
            {editingId ? "✏️ Edit Material" : "📤 Upload Study Material"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="pdf">📄 PDF Document</option>
                  <option value="video">🎥 Video Link</option>
                </select>

                <input
                  type="text"
                  placeholder="Title*"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="text"
                  placeholder="Subject*"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Category (e.g., Notes, Assignment)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="text"
                  placeholder="Tags (comma separated or JSON array)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />

                {/* File or Video URL */}
                {type === "pdf" ? (
                  <div className="file-upload">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PDF File {!editingId && "*"}
                    </label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center px-4 py-10 bg-white text-blue-500 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 w-full transition duration-200">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <span className="text-sm">
                          {file ? file.name : "Click to upload PDF"}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setFile(e.target.files[0])}
                          required={!editingId}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <input
                    type="url"
                    placeholder="Video URL* (YouTube, Vimeo, etc.)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                )}

                {/* NEW: Allow Download toggle */}
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="allowDownload"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="allowDownload" className="text-sm text-gray-700">
                    Allow users to download this file
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setSubject("");
                    setCategory("");
                    setTags("");
                    setFile(null);
                    setVideoUrl("");
                    setAllowDownload(false);
                  }}
                  className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium shadow hover:shadow-md"
              >
                {editingId ? "Update Material" : "Upload Material"}
              </button>
            </div>
          </form>
        </section>

        {/* Materials List Section */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search by title or subject..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => (
              <div
                key={material._id}
                className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white flex flex-col"
              >
                 <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                  {material.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  📚 {material.subject}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    material.type === "pdf" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {material.type === "pdf" ? "📄 PDF" : "🎥 Video"}
                  </span>
                  
                  {material.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      🏷️ {material.category}
                    </span>
                  )}

                  {/* show download permission badge */}
                  <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    material.allowDownload ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {material.allowDownload ? "🔓 Download allowed" : "🔒 Protected (no download)"}
                  </span>
                </div>

                {material.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {material.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-gray-100">
                  <a
                    href={
                      material.type === "pdf"
                        ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${material.url}`
                        : material.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200 mb-3"
                  >
                    {material.type === "pdf" ? "📥 Download PDF" : "🎬 Watch Video"}
                  </a>

                <div className="flex justify-between text-sm">
                  <button
                    onClick={() => startEdit(material)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>

                  {/* NEW: View (preview protected) */}
                  <button
                    onClick={() => openViewer(material)}
                    className="text-sky-600 hover:text-sky-800 font-medium mr-3"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDeleteClick(material._id, material.title)}
                    className="text-red-600 hover:text-red-800 font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Confirmation Dialog */}
      <ConfirmationDialog />

      {/* Viewer Modal (protected) */}
      {viewerOpen && viewerMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div id="admin-protected-root" className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{viewerMaterial.title}</h3>
                <p className="text-sm text-gray-600">{viewerMaterial.subject} • {viewerMaterial.category}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Show whether downloads are allowed */}
                <div className="text-sm">
                  {viewerMaterial.allowDownload ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">🔓 Download allowed</span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">🔒 Protected</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    // allow admin to download regardless (optionally) — keep as-is
                    if (viewerMaterial.type === "pdf") {
                      const url = `${import.meta.env.VITE_API_URL.replace("/api", "")}${viewerMaterial.url}`;
                      window.open(url, "_blank");
                    } else {
                      window.open(viewerMaterial.url, "_blank");
                    }
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Open in New Tab
                </button>

                <button onClick={closeViewer} className="px-3 py-1 border rounded text-sm">Close</button>
              </div>
            </div>

            <div className="p-4 overflow-auto protected-content" style={{
              // protected-content CSS (added programmatically too), but inline helps in some environments
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}>
              {viewerMaterial.type === "pdf" ? (
                <iframe
                  src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${viewerMaterial.url}`}
                  title={viewerMaterial.title}
                  className="w-full h-[70vh] border rounded"
                />
              ) : (
                <div className="aspect-video">
                  <iframe
                    src={viewerMaterial.url.includes("youtube") || viewerMaterial.url.includes("youtu.be")
                      ? (() => {
                          try {
                            const urlObj = new URL(viewerMaterial.url);
                            const vid = urlObj.searchParams.get("v") || viewerMaterial.url.split("youtu.be/")[1];
                            return `https://www.youtube.com/embed/${vid}`;
                          } catch {
                            return viewerMaterial.url;
                          }
                        })()
                      : viewerMaterial.url}
                    className="w-full h-[70vh] rounded"
                    title={viewerMaterial.title}
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
