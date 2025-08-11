import { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import SubjectPage from "../../components/SubjectPage";
import ProtectedTestButton from "../../components/ProtectedTestButton";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";
import { Loader2 } from "lucide-react";

const SUBJECT_DISPLAY_NAMES = {
  mathematics: { en: "Mathematics", mr: "गणित", icon: "🧮" },
  mat: { en: "Mental Ability", mr: "बौद्धिक क्षमता", icon: "🧠" },
  geography: { en: "Geography", mr: "भूगोल", icon: "🌍" },
  biology: { en: "Biology", mr: "जीवशास्त्र", icon: "🧬" },
  chemistry: { en: "Chemistry", mr: "रसायनशास्त्र", icon: "🧪" },
  civics: { en: "Civics", mr: "नागरिकशास्त्र", icon: "🏛️" },
  history: { en: "History", mr: "इतिहास", icon: "📜" },
  physics: { en: "Physics", mr: "भौतिकशास्त्र", icon: "🔬" },
};

const DynamicSubjectPage = () => {
  const { subjectName } = useParams();
  const [chapters, setChapters] = useState([]);
  const [languageFilter, setLanguageFilter] = useState("Marathi");
  const [isLoading, setIsLoading] = useState(true);
  const subjectKey = subjectName.toLowerCase();
  const subjectInfo = SUBJECT_DISPLAY_NAMES[subjectKey] || {
    en: subjectName,
    mr: subjectName,
    icon: "📘",
  };

  const heading =
    languageFilter.toLowerCase() === "english"
      ? `${subjectInfo.icon} ${subjectInfo.en} Chapters`
      : `${subjectInfo.icon} ${subjectInfo.mr} अभ्यासक्रम`;

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/chapter");
        const filtered = res.data
          .filter((ch) => ch.subject.toLowerCase() === subjectKey)
          .sort((a, b) => {
            const numA = parseInt(a.title.match(/\d+/)?.[0] || "0");
            const numB = parseInt(b.title.match(/\d+/)?.[0] || "0");
            return numA - numB;
          });

        const updated = filtered.map((ch) => {
          const videoUrl = ch.youtubeCode
            ? `https://youtu.be/${ch.youtubeCode}`
            : "";
          const freetestUrl = ch.freetestCode
            ? `https://testmoz.com/q/${ch.freetestCode}`
            : "";
          const mastertestUrl = ch.mastertestCode
            ? `https://testmoz.com/q/${ch.mastertestCode}`
            : "";

          return {
            ...ch,
            videoUrl,
            FreeTestUrl: freetestUrl,
            masterTestUrl: mastertestUrl,
            renderButtons: (
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                {freetestUrl && (
                  <button
                    onClick={() => window.open(freetestUrl, "_blank")}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded-full shadow transition flex items-center gap-1"
                  >
                    📝 {languageFilter === "English" ? "Free Test" : "मोफत टेस्ट"}
                  </button>
                )}
                {mastertestUrl && (
                  <ProtectedTestButton
                    testLink={mastertestUrl}
                    small={true}
                  />
                )}
              </div>
            ),
          };
        });

        setChapters(updated);
      } catch (err) {
        console.error("Failed to load chapters", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapters();
  }, [subjectKey, languageFilter]);

  const availableLanguages = useMemo(() => {
    return [...new Set(chapters.map((ch) => ch.language?.toLowerCase()))];
  }, [chapters]);

  const filteredChapters = chapters.filter(
    (ch) => ch.language?.toLowerCase() === languageFilter.toLowerCase()
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="relative mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 text-center">
            {heading}
          </h2>

          {availableLanguages.length > 1 && (
            <div className="absolute top-0 right-0">
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableLanguages.includes("marathi") && (
                  <option value="Marathi">मराठी</option>
                )}
                {availableLanguages.includes("english") && (
                  <option value="English">English</option>
                )}
              </select>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-gray-600">
              {languageFilter === "English"
                ? "Loading chapters..."
                : "अभ्यासक्रम लोड होत आहेत..."}
            </p>
          </div>
        ) : filteredChapters.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">
            {languageFilter === "English"
              ? "No chapters found for this subject."
              : "या विषयासाठी अभ्यासक्रम सापडले नाही."}
          </p>
        ) : (
          <SubjectPage subject={subjectName} chapters={filteredChapters} />
        )}
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-10">
        <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DynamicSubjectPage;





// import { useEffect, useState, useMemo } from "react";
// import Header from "../../components/Header";
// import SubjectPage from "../../components/SubjectPage";
// import ProtectedTestButton from "../../components/ProtectedTestButton";
// import { useParams } from "react-router-dom";
// import api from "../../utils/axios";
// import { BookOpen, Clock, Loader2 } from "lucide-react";

// const SUBJECT_DISPLAY_NAMES = {
//   mathematics: {
//     en: "Mathematics",
//     mr: "गणित",
//     icon: "🧮",
//   },
//   mat: {
//     en: "Mental Ability",
//     mr: "बौद्धिक क्षमता",
//     icon: "🧠",
//   },
//   geography: {
//     en: "Geography",
//     mr: "भूगोल",
//     icon: "🌍",
//   },
//   biology: {
//     en: "Biology",
//     mr: "जीवशास्त्र",
//     icon: "🧬",
//   },
//   chemistry: {
//     en: "Chemistry",
//     mr: "रसायनशास्त्र",
//     icon: "🧪",
//   },
//   civics: {
//     en: "Civics",
//     mr: "नागरिकशास्त्र",
//     icon: "🏛️",
//   },
//   history: {
//     en: "History",
//     mr: "इतिहास",
//     icon: "📜",
//   },
//   physics: {
//     en: "Physics",
//     mr: "भौतिकशास्त्र",
//     icon: "🔬",
//   },
// };

// const DynamicSubjectPage = () => {
//   const { subjectName } = useParams();
//   const [chapters, setChapters] = useState([]);
//   const [languageFilter, setLanguageFilter] = useState("Marathi");
//   const [isLoading, setIsLoading] = useState(true); // Added loading state

//   const subjectKey = subjectName.toLowerCase();
//   const subjectInfo = SUBJECT_DISPLAY_NAMES[subjectKey] || {
//     en: subjectName,
//     mr: subjectName,
//     icon: "📘",
//   };

//   const heading =
//     languageFilter.toLowerCase() === "english"
//       ? `${subjectInfo.icon} ${subjectInfo.en} Chapters`
//       : `${subjectInfo.icon} ${subjectInfo.mr} अध्याय`;

//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         setIsLoading(true); // Set loading to true when starting fetch
//         const res = await api.get("/chapter");
//         const filtered = res.data
//           .filter((ch) => ch.subject.toLowerCase() === subjectKey)
//           .sort((a, b) => {
//             const numA = parseInt(a.title.match(/\d+/)?.[0] || "0");
//             const numB = parseInt(b.title.match(/\d+/)?.[0] || "0");
//             return numA - numB;
//           });

//         const updated = filtered.map((ch) => {
//           const videoUrl = ch.youtubeCode
//             ? `https://youtu.be/${ch.youtubeCode}`
//             : "";
//           const freetestUrl = ch.freetestCode
//             ? `https://testmoz.com/q/${ch.freetestCode}`
//             : "";
//           const mastertestUrl = ch.mastertestCode
//             ? `https://testmoz.com/q/${ch.mastertestCode}`
//             : "";

//           return {
//             ...ch,
//             videoUrl,
//             FreeTestUrl: freetestUrl,
//             masterTestUrl: mastertestUrl,
//             renderButtons: (
//               <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
//                 {freetestUrl && (
//                   <button
//                     onClick={() => window.open(freetestUrl, "_blank")}
//                     className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded-full shadow transition flex items-center gap-1"
//                   >
//                     📝 {languageFilter === "English" ? "Free Test" : "मोफत टेस्ट"}
//                   </button>
//                 )}
//                 {mastertestUrl && (
//                   <ProtectedTestButton 
//                     testLink={mastertestUrl} 
//                     small={true}
//                     // language={languageFilter}
//                   />
//                 )}
//               </div>
//             ),
//           };
//         });

//         setChapters(updated);
//       } catch (err) {
//         console.error("Failed to load chapters", err);
//       } finally {
//         setIsLoading(false); // Set loading to false when done
//       }
//     };

//     fetchChapters();
//   }, [subjectKey, languageFilter]); // Added languageFilter to dependencies

//   const availableLanguages = useMemo(() => {
//     return [...new Set(chapters.map((ch) => ch.language?.toLowerCase()))];
//   }, [chapters]);

//   const filteredChapters = chapters.filter(
//     (ch) => ch.language?.toLowerCase() === languageFilter.toLowerCase()
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
//       <Header />
//       <main className="flex-grow container mx-auto px-4 py-6">
//         <div className="relative mb-6">
//   <h2 className="text-2xl md:text-3xl font-bold text-blue-800 text-center">
//     {heading}
//   </h2>
  
//   {availableLanguages.length > 1 && (
//     <div className="absolute top-0 right-0">
//       <select
//         value={languageFilter}
//         onChange={(e) => setLanguageFilter(e.target.value)}
//         className="border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         {availableLanguages.includes("marathi") && (
//           <option value="Marathi">मराठी</option>
//         )}
//         {availableLanguages.includes("english") && (
//           <option value="English">English</option>
//         )}
//       </select>
//     </div>
//   )}
// </div>

//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center py-12 gap-3">
//             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//             <p className="text-gray-600">
//               {languageFilter === "English" 
//                 ? "Loading chapters..." 
//                 : "अभ्यासक्रम लोड होत आहेत..."}
//             </p>
//           </div>
//         ) : filteredChapters.length === 0 ? (
//           <p className="text-center text-gray-500 mt-12">
//             {languageFilter === "English"
//               ? "No chapters found for this subject."
//               : "या विषयासाठी अभ्यासक्रम सापडले नाहीत."}
//           </p>
//         ) : (
//           <SubjectPage 
//             subject={subjectName} 
//             chapters={filteredChapters} 
//             language={languageFilter}
//           />
//         )}
//       </main>

//       <footer className="bg-gray-800 text-white text-center p-4 mt-10">
//         <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default DynamicSubjectPage;


// import { useEffect, useState, useMemo } from "react";
// import Header from "../../components/Header";
// import SubjectPage from "../../components/SubjectPage";
// import ProtectedTestButton from "../../components/ProtectedTestButton";
// import { useParams } from "react-router-dom";
// import api from "../../utils/axios";

// const SUBJECT_DISPLAY_NAMES = {
//   mathematics: {
//     en: "Mathematics",
//     mr: "गणित",
//     icon: "🧮",
//   },
//   mat: {
//     en: "Mental Ability",
//     mr: "बौद्धिक क्षमता",
//     icon: "🧠",
//   },
//   geography: {
//     en: "Geography",
//     mr: "भूगोल",
//     icon: "🌍",
//   },
//   biology: {
//     en: "Biology",
//     mr: "जीवशास्त्र",
//     icon: "🧬",
//   },
//   chemistry: {
//     en: "Chemistry",
//     mr: "रसायनशास्त्र",
//     icon: "🧪",
//   },
//   civics: {
//     en: "Civics",
//     mr: "नागरिकशास्त्र",
//     icon: "🏛️",
//   },
//   history: {
//     en: "History",
//     mr: "इतिहास",
//     icon: "📜",
//   },
//   physics: {
//     en: "Physics",
//     mr: "भौतिकशास्त्र",
//     icon: "🔬",
//   },
// };

// const DynamicSubjectPage = () => {
//   const { subjectName } = useParams();
//   const [chapters, setChapters] = useState([]);
//   const [languageFilter, setLanguageFilter] = useState("Marathi");

//   const subjectKey = subjectName.toLowerCase();
//   const subjectInfo = SUBJECT_DISPLAY_NAMES[subjectKey] || {
//     en: subjectName,
//     mr: subjectName,
//     icon: "📘",
//   };

//   const heading =
//     languageFilter.toLowerCase() === "english"
//       ? `${subjectInfo.icon} ${subjectInfo.en} Chapters`
//       : `${subjectInfo.icon} ${subjectInfo.mr} अध्याय`;

//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         const res = await api.get("/chapter");
//         const filtered = res.data
//           .filter(
//             (ch) => ch.subject.toLowerCase() === subjectKey
//           )
//           .sort((a, b) => {
//             const numA = parseInt(a.title.match(/\d+/)?.[0] || "0");
//             const numB = parseInt(b.title.match(/\d+/)?.[0] || "0");
//             return numA - numB;
//           });

//         const updated = filtered.map((ch) => {
//           const videoUrl = ch.youtubeCode
//             ? `https://youtu.be/${ch.youtubeCode}`
//             : "";
//           const freetestUrl = ch.freetestCode
//             ? `https://testmoz.com/q/${ch.freetestCode}`
//             : "";
//           const mastertestUrl = ch.mastertestCode
//             ? `https://testmoz.com/q/${ch.mastertestCode}`
//             : "";

//           return {
//             ...ch,
//             videoUrl,
//             FreeTestUrl: freetestUrl,
//             masterTestUrl: mastertestUrl,
//             renderButtons: (
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {freetestUrl && (
//                   <button
//                     onClick={() => window.open(freetestUrl, "_blank")}
//                     className="bg-green-500 text-white text-sm sm:text-base font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-center shadow hover:bg-green-600 transition"
//                   >
//                     📝 Free Test
//                   </button>
//                 )}
//                 {mastertestUrl && (
//                   <ProtectedTestButton testLink={mastertestUrl} small={true} />
//                 )}
//               </div>
//             ),
//           };
//         });

//         setChapters(updated);
//       } catch (err) {
//         console.error("Failed to load chapters", err);
//       }
//     };

//     fetchChapters();
//   }, [subjectKey]);

//   const availableLanguages = useMemo(() => {
//     return [...new Set(chapters.map((ch) => ch.language?.toLowerCase()))];
//   }, [chapters]);

//   const filteredChapters = chapters.filter(
//     (ch) =>
//       ch.language?.toLowerCase() === languageFilter.toLowerCase()
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
//       <Header />
//       <main className="flex-grow container mx-auto px-4 py-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//           <h2 className="text-3xl font-bold text-blue-800 text-center w-full">
//             {heading}
//           </h2>

//           {availableLanguages.length > 1 && (
//             <div className="flex justify-center sm:justify-end w-full sm:w-auto">
//               <select
//                 value={languageFilter}
//                 onChange={(e) => setLanguageFilter(e.target.value)}
//                 className="border px-3 py-1.5 rounded shadow"
//               >
//                 {availableLanguages.includes("marathi") && (
//                   <option value="Marathi">मराठी</option>
//                 )}
//                 {availableLanguages.includes("english") && (
//                   <option value="English">English</option>
//                 )}
//               </select>
//             </div>
//           )}
//         </div>

//         {filteredChapters.length === 0 ? (
//           <p className="text-center text-gray-500 mt-12">
//             No chapters found for this subject.
//           </p>
//         ) : (
//           <SubjectPage subject={subjectName} chapters={filteredChapters} />
//         )}
//       </main>

//       <footer className="bg-gray-800 text-white text-center p-4 mt-10">
//         <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default DynamicSubjectPage;