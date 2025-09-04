
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import mathsImage from "../../assets/maths.png";
import scienceImage from "../../assets/science.png";
import historyImage from "../../assets/itihas.png";
import geographyImage from "../../assets/bhugol.png";
import { useState, useEffect } from "react";

const Sat = () => {
  const [loading, setLoading] = useState(true);

  const subjects = [
    { name: "Mathematics", path: "/dynamic/mathematics", image: mathsImage },
    { name: "Science", path: "/NMMS/science", image: scienceImage },
    { name: "Geography", path: "/dynamic/geography", image: geographyImage },
    { name: "History", path: "/NMMS/social-studies", image: historyImage },
  ];

  useEffect(() => {
    // Preload all images before showing page
    const imagePromises = subjects.map(
      (subject) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = subject.image;
          img.onload = resolve;
        })
    );
    Promise.all(imagePromises).then(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-white">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold mb-12 text-center text-amber-800">
          SAT
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <Link to={subject.path} className="flex flex-col h-full">
                <div className="flex-grow p-2 flex items-center justify-center">
                  <img
                    src={subject.image}
                    alt={subject.name}
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-gray-50 border-t border-gray-100">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center">
                    {subject.name}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-12">
        <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Sat;
