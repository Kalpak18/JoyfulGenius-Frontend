import { useEffect, useState, useMemo } from "react";
import api from "../utils/axios";
import { Search } from "lucide-react";
import dayjs from "dayjs";
import Header from "../components/Header";

const StudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showPlayerMap, setShowPlayerMap] = useState({});

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/materials");
      setMaterials(res.data?.data || []);
    } catch (err) {
      console.error("Fetch materials error:", err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const getYouTubeID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const filteredMaterials = useMemo(() => {
    return [...materials]
      .filter(
        (m) =>
          (m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.chapter.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (subjectFilter ? m.subject === subjectFilter : true)
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [materials, searchQuery, subjectFilter, sortOrder]);

  const subjects = [...new Set(materials.map((m) => m.subject))];

  const typeBadgeColor = (type) => {
    if (type === "pdf") return "bg-blue-200 text-blue-800";
    if (type === "video") return "bg-green-200 text-green-800";
    if (type === "youtube") return "bg-red-200 text-red-800";
    return "bg-gray-200 text-gray-800";
  };

  const handleThumbnailClick = (id) => {
    setShowPlayerMap((prev) => ({ ...prev, [id]: true }));
  };

  const getThumbnail = (mat) => {
    if (mat.type === "youtube") {
      const id = getYouTubeID(mat.youtubeLink);
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    if (mat.type === "video") return "/video-placeholder.png";
    if (mat.type === "pdf") return "/pdf-placeholder.png";
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Header />
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4 text-zinc-800">Study Materials</h1>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or chapter"
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
          {loading ? (
            <p>Loading materials...</p>
          ) : filteredMaterials.length > 0 ? (
            filteredMaterials.map((mat) => {
              const youtubeID = mat.type === "youtube" ? getYouTubeID(mat.youtubeLink) : null;
              const thumbnail = getThumbnail(mat);

              return (
                <div
                  key={mat._id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${typeBadgeColor(
                          mat.type
                        )}`}
                      >
                        {mat.type.toUpperCase()}
                      </span>
                      {mat.downloadable && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-black text-white">
                          DOWNLOADABLE
                        </span>
                      )}
                    </div>

                    <p className="font-semibold text-lg mb-1">{mat.title}</p>
                    <p className="text-sm text-gray-500 mb-1">
                      {mat.subject} | {mat.chapter}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      Uploaded: {dayjs(mat.createdAt).format("DD MMM YYYY")}
                    </p>

                    {/* Preview Section */}
                    {thumbnail && (
                      <div className="mt-2 relative">
                        {/* YouTube */}
                        {mat.type === "youtube" && youtubeID && (
                          <>
                            {!showPlayerMap[mat._id] ? (
                              <img
                                src={thumbnail}
                                alt={mat.title}
                                className="w-full h-40 md:h-48 rounded object-cover cursor-pointer"
                                onClick={() => handleThumbnailClick(mat._id)}
                              />
                            ) : (
                              <iframe
                                className="w-full h-40 md:h-48 rounded"
                                src={`https://www.youtube.com/embed/${youtubeID}?autoplay=1`}
                                title={mat.title}
                                allowFullScreen
                              ></iframe>
                            )}
                          </>
                        )}

                        {/* MP4 Video */}
                        {mat.type === "video" && (
                          <video
                            className="w-full h-40 md:h-48 rounded object-cover"
                            controls
                            src={`${api.defaults.baseURL}/materials/${mat._id}/stream`}
                          />
                        )}

                        {/* PDF */}
                        {mat.type === "pdf" && (
                          <div className="relative w-full flex flex-col items-center">
                            <img
                              src={thumbnail}
                              alt={mat.title}
                              className="w-full h-40 md:h-48 rounded object-cover cursor-pointer"
                            />
                            <button
                              onClick={() =>
                                window.open(
                                  `${api.defaults.baseURL}/materials/${mat._id}/stream#toolbar=0`,
                                  "_blank"
                                )
                              }
                              className="mt-2 bg-black text-white px-3 py-1 rounded text-sm"
                            >
                              View PDF
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No materials found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyMaterial;





// import React, { useEffect, useState, useCallback } from "react";
// import React, { useEffect, useState } from "react";
// import api from "../utils/axios";
// import Header from "../components/Header";
// import { Download, FileText, X } from "lucide-react";
// @@ -440,6 +439,16 @@
//   return url;
// };

// const LoaderOverlay = ({ text = "Loading study materials..." }) => (
//   <div className="fixed inset-0 z-50 bg-gradient-to-br from-yellow-100 via-white to-yellow-50 flex flex-col items-center justify-center">
//     <div className="relative w-20 h-20">
//       <div className="absolute inset-0 border-4 border-amber-300 rounded-full animate-ping"></div>
//       <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin"></div>
//     </div>
//     <p className="text-amber-700 font-semibold text-lg mt-4 animate-pulse">{text}</p>
//   </div>
// );

// const StudyMaterial = () => {
//   const [materials, setMaterials] = useState([]);
//   const [search, setSearch] = useState("");
// @@ -450,13 +459,22 @@
//   const [protectedView, setProtectedView] = useState({ open: false, url: "", title: "" });
//   const [isBlurred, setIsBlurred] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState("");

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       setLoading(true);
//       setFetchError("");
//       try {
//         const res = await api.get("/materials");
//         // keep original behaviour: reverse order
//         setMaterials(res.data.reverse());
//       } catch (err) {
//         console.error("Failed to fetch materials:", err);
//         setFetchError("Failed to load study materials. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMaterials();
// @@ -524,8 +542,12 @@

//   return (
//     <div>
//       {/* Loader overlay while fetching */}
//       {loading && <LoaderOverlay text="Loading study materials..." />}

//       <Header />
//       <div className="p-4 max-w-6xl mx-auto">

//       <div className={`p-4 max-w-6xl mx-auto transition-opacity duration-700 ${loading ? "opacity-0" : "opacity-100"}`}>
//         <h1 className="text-2xl font-bold mb-4 text-center text-zinc-800">Study Materials</h1>

//         {/* Filter Controls */}
// @@ -606,97 +628,112 @@
//           </div>
//         </div>

//         {/* Materials Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredMaterials.map((item) => (
//             <div
//               key={item._id}
//               className="border border-zinc-200 p-4 rounded shadow-sm bg-white hover:shadow-md transition"
//             >
//               <h2 className="text-lg font-semibold text-zinc-800 mb-1">{item.title}</h2>
//               <p className="text-sm text-zinc-500 mb-2">Subject: <span className="font-medium text-zinc-700">{item.subject}</span></p>
//               <p className="text-xs text-zinc-400 mb-3">Uploaded {formatDistanceToNow(new Date(item.createdAt))} ago</p>

//               {item.type === "video" ? (
//                 <div className="aspect-w-16 aspect-h-9 mb-2">
//                   <iframe
//                     src={getEmbedUrl(item.url)}
//                     title={item.title}
//                     allowFullScreen
//                     className="w-full h-48 rounded"
//                   ></iframe>
//                 </div>
//               ) : (
//                 <div className="mb-3">
//                   <div className="aspect-w-16 aspect-h-9 border rounded overflow-hidden mb-2">
//         {/* Fetch error */}
//         {fetchError && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-center">
//             {fetchError}
//           </div>
//         )}

//         {/* Materials Grid or Empty Message */}
//         {!loading && filteredMaterials.length === 0 ? (
//           <div className="text-center py-10 text-gray-500">
//             <p className="text-lg">📭 No study materials available.</p>
//             <p className="text-sm mt-2">Try changing filters or check back later.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredMaterials.map((item) => (
//               <div
//                 key={item._id}
//                 className="border border-zinc-200 p-4 rounded shadow-sm bg-white hover:shadow-md transition"
//               >
//                 <h2 className="text-lg font-semibold text-zinc-800 mb-1">{item.title}</h2>
//                 <p className="text-sm text-zinc-500 mb-2">Subject: <span className="font-medium text-zinc-700">{item.subject}</span></p>
//                 <p className="text-xs text-zinc-400 mb-3">Uploaded {formatDistanceToNow(new Date(item.createdAt))} ago</p>

//                 {item.type === "video" ? (
//                   <div className="aspect-w-16 aspect-h-9 mb-2">
//                     <iframe
//                       src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`}
//                       className="w-full h-48"
//                       src={getEmbedUrl(item.url)}
//                       title={item.title}
//                     />
//                       allowFullScreen
//                       className="w-full h-48 rounded"
//                     ></iframe>
//                   </div>
//                   {item.allowDownload ? (
//                     <a
//                       href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
//                     >
//                       <FileText size={18} /> View Full PDF
//                     </a>
//                   ) : (
//                     <button
//                       onClick={() => openProtectedPDF(`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`, item.title)}
//                       className="flex items-center gap-2 text-red-600 hover:underline text-sm"
//                     >
//                       🔒 View Securely
//                     </button>
//                   )}
//                 </div>
//               )}

//               {item.allowDownload && item.type === "pdf" && (
//                 <a
//                   href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`}
//                   download
//                   className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
//                 >
//                   <Download size={16} /> Download
//                 </a>
//               )}
//             </div>
//           ))}
//         </div>
//                 ) : (
//                   <div className="mb-3">
//                     <div className="aspect-w-16 aspect-h-9 border rounded overflow-hidden mb-2">
//                       <iframe
//                         src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`}
//                         className="w-full h-48"
//                         title={item.title}
//                       />
//                     </div>

//                     {item.allowDownload ? (
//                       <a
//                         href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
//                       >
//                         <FileText size={18} /> View Full PDF
//                       </a>
//                     ) : (
//                       <button
//                         onClick={() => openProtectedPDF(`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`, item.title)}
//                         className="flex items-center gap-2 text-red-600 hover:underline text-sm"
//                       >
//                         🔒 View Securely
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {item.allowDownload && item.type === "pdf" && (
//                   <a
//                     href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`}
//                     download
//                     className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
//                   >
//                     <Download size={16} /> Download
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Protected PDF Modal */}
//       {protectedView.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full relative p-4 select-none">
//             <button
//               onClick={closeProtectedPDF}
//               className="absolute top-2 right-2 text-gray-600 hover:text-black"
//             >
//               <X size={20} />
//             </button>
//             <h2 className="text-lg font-bold mb-3">{protectedView.title}</h2>
//             <div className={`relative w-full h-[80vh] border rounded overflow-hidden ${isBlurred ? "blur-lg" : ""}`}>
//               <iframe
//                 src={protectedView.url}
//                 className="w-full h-full pointer-events-none"
//                 title="Protected PDF"
//               />
//               {isBlurred && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white text-xl font-bold">
//                   Screenshot/Copy Blocked
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudyMaterial;