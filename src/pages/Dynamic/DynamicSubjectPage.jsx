import { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import SubjectPage from "../../components/SubjectPage";
import ProtectedTestButton from "../../components/ProtectedTestButton";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";
import { Loader2 } from "lucide-react";

// Hardcoded NMMS mapping
const NMMS_COURSE_ID = "68a22e67ba843698d32c427a";

const NMMS_SUBJECTS = {
  mathematics: "68a4dc984e374e1e2e3987b6",
  mat: "68a4dd574e374e1e2e3987d7",
  geography: "68a22f3b818c4b22b1dac9c8",
  biology: "68a4dcf24e374e1e2e3987ca",
  chemistry: "68a4dce74e374e1e2e3987c5",
  civics: "68a4dd124e374e1e2e3987d2",
  history: "68a4dcc64e374e1e2e3987bb",
  physics: "68a4dcdc4e374e1e2e3987c0",
};

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

  // Keep these to pass down to ProtectedTestButton for per-course paid check
  const [resolvedCourseId, setResolvedCourseId] = useState(null);
  const [resolvedCourseName, setResolvedCourseName] = useState(null);

  const subjectKey = (subjectName || "").toLowerCase();
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

        let chaptersData = [];
        let courseIdForPage = null;
        let courseNameForPage = null;

        // 1) Try NMMS (subject lookup by name in the NMMS course)
        let nmmsSubjectId = null;
        try {
          const byName = await api.get(
            `/subjects/by-name/${NMMS_COURSE_ID}/${subjectKey}`
          );
          nmmsSubjectId = byName?.data?._id || null;
        } catch {
          // ignore; fall back to local map or generic flow
        }

        // Fallback to local hardcoded NMMS map if API by-name didn't find it
        if (!nmmsSubjectId && NMMS_SUBJECTS[subjectKey]) {
          nmmsSubjectId = NMMS_SUBJECTS[subjectKey];
        }

        if (nmmsSubjectId) {
          // ✅ NMMS flow: fetch by (course + subject)
          const res = await api.get(
            `/chapters/${NMMS_COURSE_ID}/${nmmsSubjectId}`
          );
          chaptersData = Array.isArray(res.data) ? res.data : [];

          courseIdForPage = NMMS_COURSE_ID;
          courseNameForPage = "NMMS";
        } else {
          // ✅ Generic flow: fetch all & filter by subject name
          const res = await api.get("/chapter");
          const all = Array.isArray(res.data) ? res.data : [];
          chaptersData = all.filter(
            (ch) => (ch?.subject || "").toLowerCase() === subjectKey
          );

          // Try to infer courseId/name from the first chapter
          if (chaptersData.length > 0) {
            const c0 = chaptersData[0];
            courseIdForPage =
              c0?.courseId?._id || c0?.courseId || c0?.course?._id || null;
            courseNameForPage =
              c0?.courseName ||
              c0?.course?.name ||
              c0?.courseId?.name ||
              null;
          }
        }

        // ✅ Save course info BEFORE mapping chapters
        setResolvedCourseId(courseIdForPage || null);
        setResolvedCourseName(courseNameForPage || null);

        // 2) Sort & decorate chapters
        const updated = chaptersData
          .slice()
          .sort((a, b) => {
            const na = parseInt((a?.title || "").match(/\d+/)?.[0] || "0", 10);
            const nb = parseInt((b?.title || "").match(/\d+/)?.[0] || "0", 10);
            return na - nb;
          })
          .map((ch) => {
            const youtubeCode = ch?.youtubeCode || "";
            const videoUrl = youtubeCode ? `https://youtu.be/${youtubeCode}` : "";

            const freetestCode = ch?.freetestCode || "";
            const freetestUrl = freetestCode
              ? `https://testmoz.com/q/${freetestCode}`
              : "";

            const mastertestCode = ch?.mastertestCode || "";
            const mastertestUrl = mastertestCode
              ? `https://testmoz.com/q/${mastertestCode}`
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
                      📝{" "}
                      {languageFilter === "English"
                        ? "Free Test"
                        : "मोफत टेस्ट"}
                    </button>
                  )}

                  {mastertestUrl && courseIdForPage && (
                    <ProtectedTestButton
                      testLink={mastertestUrl}
                      courseId={courseIdForPage.toString()}
                      courseName={courseNameForPage}
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
        setChapters([]);
        setResolvedCourseId(null);
        setResolvedCourseName(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectKey, languageFilter]);

  const availableLanguages = useMemo(() => {
    return [...new Set(chapters.map((ch) => ch?.language?.toLowerCase()))].filter(
      Boolean
    );
  }, [chapters]);

  const filteredChapters = chapters.filter(
    (ch) => (ch?.language || "").toLowerCase() === languageFilter.toLowerCase()
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
