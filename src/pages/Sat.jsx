// // src/pages/StudyMaterials.jsx
// import Header from "../components/Header";
// import mathsImage from "../assets/maths.png"; // Import the image
// import scienceImage from "../assets/science.png"; // Import the image
// import historyImage from "../assets/itihas.png"; // Import the image
// import geographyImage from "../assets/bhugol.png"; // Import the
// const Sat = () => {
//   return (
//     <div>
//       <Header />
//       <main className="container mx-auto p-4">
//         <h1 className="text-3xl font-bold mb-6">SAT</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Mathematics Card */}
//           <div className="bg-white p-6 justify-items-center shadow-md text-center">
//             <a href="/maths">
//             <img
//               src={mathsImage} // Use the imported image
//               alt="Mathematics"
//               className="w-64 h-80 object-center mb-4"
//             />
//             <h2 className="text-xl object-bottom font-bold mb-4">Mathematics</h2>
//            </a>
//           </div>

//           {/* Science Card */}
//           <div className="bg-white p-6 justify-items-center rounded-lg shadow-md">
//             <a href="/science">
//             <img
//               src={scienceImage} // Use the imported image
//               alt="Science"
//               className="w-64 h-80 object-center mb-4"
//             />
//             <h2 className="text-xl font-bold mb-4">Science</h2>
//            </a>
//           </div>

//           {/* Social Studies Card */}
//           <div className="bg-white p-6 justify-items-center rounded-lg shadow-md">
//             <a href="/geography">
//             <img
//               src={geographyImage} // Use the imported image
//               alt="Social Studies"
//               className="w-64 h-80 object-center mb-4"
//             />
//             <h2 className="text-xl font-bold mb-4">Geography</h2>
//             </a>
//           </div>

//           <div className="bg-white p-6 justify-items-center rounded-lg shadow-md">
//             <a href="/social-studies">
//             <img
//               src={historyImage} // Use the imported image
//               alt="Social Studies"
//               className="w-64 h-80 object-center mb-4"
//             />
//             <h2 className="text-xl font-bold mb-4">History</h2>
//             </a>
//           </div>
//         </div>
//       </main>
//       <footer className="bg-white text-gray-800 text-center p-3 mt-auto">
//         <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Sat;


import { Link } from "react-router-dom";
import Header from "../components/Header";
import mathsImage from "../assets/maths.png";
import scienceImage from "../assets/science.png";
import historyImage from "../assets/itihas.png";
import geographyImage from "../assets/bhugol.png";

const Sat = () => {
  const subjects = [
    {
      name: "Mathematics",
      // path: "/maths",
      path: "/Mathematics",
      image: mathsImage,
    },
    {
      name: "Science",
      path: "/science",
      image: scienceImage,
    },
    {
      name: "Geography",
      path: "/Geography",
      image: geographyImage,
    },
    {
      name: "History",
      path: "/social-studies",
      image: historyImage,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen  bg-gradient-to-b from-yellow-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold mb-12 text-center text-amber-800">
          SAT 
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {subjects.map((subject) => (
            <div 
              key={subject.name}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <Link 
                to={subject.path} 
                className="flex flex-col h-full"
              >
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