
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";

const getVideoId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};


const SubjectPage = ({ subject, chapters }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [language, setLanguage] = useState("all");

  useEffect(() => {
    const disableActions = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableActions);
    document.addEventListener("copy", disableActions);
    document.addEventListener("cut", disableActions);
    document.addEventListener("selectstart", disableActions);
    return () => {
      document.removeEventListener("contextmenu", disableActions);
      document.removeEventListener("copy", disableActions);
      document.removeEventListener("cut", disableActions);
      document.removeEventListener("selectstart", disableActions);
    };
  }, []);

  const filteredChapters = chapters.filter((chapter) => {
    const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang =
      language === "all" || chapter.language?.toLowerCase() === language.toLowerCase();
    return matchesSearch && matchesLang;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <main className="flex-grow container mx-auto px-4 py-4 sm:py-6">
        {/* Header */}
        {/* <div className="flex items-center justify-between flex-wrap gap-3 mb-4"> */}
          {/* <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ArrowLeft size={22} />
              <span className="text-sm sm:text-base">Back</span>
            </button>
          </div> */}

          {/* <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-700 hover:text-gray-900"
              title="Search"
            >
              <Search size={24} />
            </button>

            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-3 py-1 w-36 sm:w-60 shadow"
              />
            )}
          </div>
        </div> */}

        {/* Grid of chapters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {filteredChapters.map((chapter, index) => {
          const videoId = getVideoId(chapter.videoUrl);
          const thumbnail = videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : null;

            return (
              <div
                key={index}
                className="bg-white border rounded-xl shadow hover:shadow-md transition flex flex-col
                  p-3 sm:p-4
                  text-sm sm:text-base
                  max-h-[260px] sm:max-h-full"
              >
                {thumbnail ? (
                  <a
                    href={chapter.videoUrl}
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-video overflow-hidden rounded-xl"
                  >
                    <img
                      src={thumbnail}
                      alt={chapter.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </a>
                ) : (
                  <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-gray-500 rounded-xl">
                    No Thumbnail
                  </div>
                )}

                <h3 className="mt-2 font-semibold text-gray-800 leading-tight line-clamp-2">
                  {chapter.title}
                </h3>

                {/* ✅ Dynamic Buttons from chapter */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {chapter.renderButtons}
                </div>
              </div>
            );
          })}

        </div>
      </main>
    </div>
  );
};

export default SubjectPage;
