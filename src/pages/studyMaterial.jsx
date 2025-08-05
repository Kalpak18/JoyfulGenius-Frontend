

//   // src/pages/StudyMaterial.jsx
// import { useEffect, useState } from "react";
// import api from "../utils/axios";
// import { formatDistanceToNow } from "date-fns";
// import Header from "../components/Header";

// const getEmbedUrl = (url) => {
//   if (url.includes("youtube.com/watch")) {
//     const videoId = new URL(url).searchParams.get("v");
//     return `https://www.youtube.com/embed/${videoId}`;
//   }
//   if (url.includes("youtu.be/")) {
//     const videoId = url.split("youtu.be/")[1];
//     return `https://www.youtube.com/embed/${videoId}`;
//   }
//   if (url.includes("drive.google.com/file/d/")) {
//     const fileId = url.match(/\/file\/d\/(.*?)\//)?.[1];
//     return `https://drive.google.com/file/d/${fileId}/preview`;
//   }
//   return url;
// };


// const StudyMaterial = () => {
//   const [materials, setMaterials] = useState([]);
//   const [search, setSearch] = useState("");
//   const [subjectFilter, setSubjectFilter] = useState("");
//   const [showSubjectModal, setShowSubjectModal] = useState(false);
//   const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest


//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await api.get("/materials");
//       setMaterials(res.data.reverse());
//     };
//     fetchData();
//   }, []);

//  const filtered = materials
//   .filter((mat) => {
//     const inSearch =
//       mat.title.toLowerCase().includes(search.toLowerCase()) ||
//       mat.subject.toLowerCase().includes(search.toLowerCase());
//     const inSubject = subjectFilter
//       ? mat.subject.toLowerCase() === subjectFilter.toLowerCase()
//       : true;
//     return inSearch && inSubject;
//   })
//   .sort((a, b) => {
//     if (sortOrder === "oldest") {
//       return new Date(a.createdAt) - new Date(b.createdAt);
//     } else {
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     }
//   });


//   const uniqueSubjects = [...new Set(materials.map((m) => m.subject))];

//   return (
//     <div>
//       <Header />
//       <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
//         <h1 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">📚 Study Materials</h1>

//         {/* Search and Filter Controls */}
//         <div className="flex flex-row gap-2 mb-4 sm:mb-6">
//           <input
//             type="text"
//             placeholder="🔍 Search..."
//             className="p-2 border rounded flex-grow text-sm sm:text-base"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
          
//           {/* Mobile: Button that opens modal */}
//           <button 
//             onClick={() => setShowSubjectModal(true)}
//             className="sm:hidden p-2 border rounded w-[40%] min-w-[120px] text-left truncate flex items-center justify-between"
//           >
//             <span className="truncate">{subjectFilter || "All Subjects"}</span>
//             <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
          
//           {/* Desktop: Normal select */}
//           <select
//             className="hidden sm:block p-2 border rounded text-sm sm:text-base w-[40%] min-w-[120px]"
//             value={subjectFilter}
//             onChange={(e) => setSubjectFilter(e.target.value)}
//           >
//             <option value="">All Subjects</option>
//             {uniqueSubjects.map((subj, i) => (
//               <option key={i} value={subj} className="truncate">
//                 {subj}
//               </option>
//             ))}
//           </select>
//           <select
//             className="p-2 border rounded text-sm sm:text-base w-[40%] min-w-[120px]"
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//           >
//             <option value="newest">📅 Newest First</option>
//             <option value="oldest">📂 Oldest First</option>
//           </select>

//         </div>

//         {/* Mobile Subject Selection Modal */}
//         {showSubjectModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
//               <div className="p-4 border-b">
//                 <h3 className="font-bold text-lg">Select Subject</h3>
//               </div>
//               <div className="overflow-y-auto flex-1">
//                 <div 
//                   className="p-3 hover:bg-gray-100 cursor-pointer border-b"
//                   onClick={() => {
//                     setSubjectFilter("");
//                     setShowSubjectModal(false);
//                   }}
//                 >
//                   All Subjects
//                 </div>
//                 {uniqueSubjects.map((subj, i) => (
//                   <div 
//                     key={i}
//                     className="p-3 hover:bg-gray-100 cursor-pointer border-b"
//                     onClick={() => {
//                       setSubjectFilter(subj);
//                       setShowSubjectModal(false);
//                     }}
//                   >
//                     {subj}
//                   </div>
//                 ))}
//               </div>
//               <div className="p-4 border-t">
//                 <button 
//                   onClick={() => setShowSubjectModal(false)}
//                   className="w-full p-2 bg-gray-200 rounded hover:bg-gray-300"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Materials Grid */}
//         {filtered.length === 0 ? (
//           <p className="text-center text-gray-600">No materials found.</p>
//         ) : (
//           <div className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {filtered.map((mat) => (
//               <div
//                 key={mat._id}
//                 className={`border rounded-lg p-2 sm:p-4 shadow-sm bg-white hover:shadow-md transition flex flex-col justify-between ${
//                   mat.type === "video" ? "col-span-3 md:col-span-1" : ""
//                 }`}
//               >
//                 {/* Material content remains same */}
//                 <div className="flex justify-between items-center mb-1 gap-1">
//                   <h2 className="text-sm sm:text-base md:text-lg font-semibold line-clamp-1">{mat.title}</h2>
//                   <span className="bg-blue-100 text-blue-800 text-xs px-1 sm:px-2 py-1 rounded whitespace-nowrap">
//                   📚 {mat.subject}
//                   </span>
//                 </div>

//                 <p className="text-xs text-gray-500 mb-2 sm:mb-3">
//                   Uploaded {formatDistanceToNow(new Date(mat.createdAt))} ago
//                 </p>

//                 <div className="mt-auto">
//                   {mat.type === "pdf" ? (
//                     <>
//                       <iframe
//                         src={`${import.meta.env.VITE_API_URL}${mat.url}`}
//                         className="w-full h-28 sm:h-48 rounded border"
//                       ></iframe>
//                       <a
//                         href={`${import.meta.env.VITE_API_URL}${mat.url}`}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="mt-1 sm:mt-2 inline-block text-xs sm:text-sm text-blue-600 underline"
//                         download
//                       >
//                         ⬇️ Download PDF
//                       </a>
//                     </>
//                   ) : (
//                     <div className="aspect-video mt-1 sm:mt-2">
//                       <iframe
//                         src={getEmbedUrl(mat.url)}
//                         title={mat.title}
//                         allowFullScreen
//                         className="w-full h-full rounded"
//                       ></iframe>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudyMaterial;

import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import Header from "../components/Header";
import { Download, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getEmbedUrl = (url) => {
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("drive.google.com/file/d/")) {
    const fileId = url.match(/\/file\/d\/(.*?)\//)?.[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
};

const StudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  

  useEffect(() => {
     const fetchMaterials = async () => {
    try {
      const res = await api.get("/materials");
      setMaterials(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    }
  };
    fetchMaterials();
  }, []);

 

  const filteredMaterials = materials
    .filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (subjectFilter ? item.subject === subjectFilter : true)
    )
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      else return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const uniqueSubjects = [...new Set(materials.map((m) => m.subject))];

  return (
    <div>
      <Header />
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center text-zinc-800">Study Materials</h1>

        {/* Filter Controls */}
        <div className="mb-4 sm:mb-6">
          {/* Desktop Layout */}
          <div className="hidden sm:grid grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="🔍 Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full text-sm"
            />

            <select
              className="p-2 border border-gray-300 rounded w-full text-sm"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">📘 All Subjects</option>
              {uniqueSubjects.map((subj, i) => (
                <option key={i} value={subj}>{subj}</option>
              ))}
            </select>

            <select
              className="p-2 border border-gray-300 rounded w-full text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">⏳ Newest</option>
              <option value="oldest">📂 Oldest</option>
            </select>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-1 text-sm text-green-600 border border-green-500 px-3 py-1 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-5.586 5.586A1 1 0 0115 13v5a1 1 0 01-.553.894l-4 2A1 1 0 019 20v-7.414a1 1 0 01.293-.707L15 5.414V4H4a1 1 0 01-1-1z" />
                </svg>
                Filters
              </button>
            </div>

            {showMobileFilters && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="🔍 Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded w-full text-xs"
                />

                <select
                  className="p-1.5 border border-gray-300 rounded w-full text-xs"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                >
                  <option value="">📘 All Subjects</option>
                  {uniqueSubjects.map((subj, i) => (
                    <option key={i} value={subj}>{subj}</option>
                  ))}
                </select>

                <select
                  className="p-1.5 border border-gray-300 rounded w-full text-xs"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">⏳ Newest</option>
                  <option value="oldest">📂 Oldest</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((item) => (
          <div
            key={item._id}
            className="border border-zinc-200 p-4 rounded shadow-sm bg-white hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-zinc-800 mb-1">{item.title}</h2>
            <p className="text-sm text-zinc-500 mb-2">Subject: <span className="font-medium text-zinc-700">{item.subject}</span></p>
            <p className="text-xs text-zinc-400 mb-3">Uploaded {formatDistanceToNow(new Date(item.createdAt))} ago</p>

            {item.type === "video" ? (
              <div className="aspect-w-16 aspect-h-9 mb-2">
                <iframe
                  src={getEmbedUrl(item.url)}
                  title={item.title}
                  allowFullScreen
                  className="w-full h-48 rounded"
                ></iframe>
              </div>
            ) : (
              <div className="mb-3">
                <div className="aspect-w-16 aspect-h-9 border rounded overflow-hidden mb-2">
                  <iframe
                    src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`}
                    className="w-full h-48"
                    title={item.title}
                  />
                </div>
                <a
                  href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                >
                  <FileText size={18} /> View Full PDF
                </a>
              </div>
            )}

            <a
              href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.url}`}
              download
              className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              <Download size={16} /> Download
            </a>
          </div>
        ))}

        </div>
      </div>
    </div>
  );
};

export default StudyMaterial;
