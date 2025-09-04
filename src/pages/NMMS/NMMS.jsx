
import { useState } from "react";
import Header from "../../components/Header";
import SATImage from "../../assets/SAT.jpg";
import MATImage from "../../assets/MAT.jpg";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const NMMS = () => {
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  const allLoaded = imagesLoaded >= 2;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Modern Full-page Loader */}
      {!allLoaded && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-yellow-100 via-white to-yellow-50 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-amber-300 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-700 font-semibold text-lg mt-4 animate-pulse">
            Preparing resources...
          </p>
        </div>
      )}

      <Header />

      <main
        className={`flex-grow container mx-auto px-4 pt-6 pb-24 transition-opacity duration-700 ${
          allLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <GraduationCap size={36} className="text-amber-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 tracking-wide">
            NMMS Exam Portal
          </h2>
        </div>

        {/* Responsive layout: stacked on mobile/tablet, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SAT Book */}
          <div className="bg-white p-4 shadow-md text-center rounded-xl hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
              Scholastic Aptitude Test (SAT)
            </h3>
            <Link to="/NMMS/sat">
              <img
                src={SATImage}
                alt="SAT Book"
                onLoad={handleImageLoad}
                className="w-48 sm:w-52 md:w-56 lg:w-60 mx-auto mb-3 transform hover:scale-105 transition duration-300"
              />
            </Link>
          </div>

          {/* MAT Book */}
          <div className="bg-white p-4 shadow-md text-center rounded-xl hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
              Mental Ability Test (MAT)
            </h3>
            <Link to="/dynamic/MAT">
              <img
                src={MATImage}
                alt="MAT Book"
                onLoad={handleImageLoad}
                className="w-48 sm:w-52 md:w-56 lg:w-60 mx-auto mb-3 transform hover:scale-105 transition duration-300"
              />
            </Link>
          </div>
        </div>
      </main>

      <footer className="hidden md:block bg-gray-800 text-white text-center py-4">
        <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NMMS;
