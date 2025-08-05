import Header from "../components/Header";
import SATImage from "../assets/SAT.jpg";
import MATImage from "../assets/MAT.jpg";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Course = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center justify-center gap-3 mb-6">
        <GraduationCap size={36} className="text-amber-600" />
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 tracking-wide">
          NMMS Exam Portal
        </h2>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* SAT Book */}
          <div className="bg-white p-4 shadow-md text-center rounded-xl hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
              Scholastic Aptitude Test (SAT)
            </h3>
            <Link to="/sat">
              <img
                src={SATImage}
                alt="SAT Book"
                className="w-40 sm:w-44 md:w-52 mx-auto mb-3 transform hover:scale-105 transition duration-300"
              />
            </Link>
          </div>

          {/* MAT Book */}
          <div className="bg-white p-4 shadow-md text-center rounded-xl hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
              Mental Ability Test (MAT)
            </h3>
            <Link to="/MAT">
              <img
                src={MATImage}
                alt="MAT Book"
                className="w-40 sm:w-44 md:w-52 mx-auto mb-3 transform hover:scale-105 transition duration-300"
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

export default Course;



// import Header from "../components/Header";
// import SATImage from "../assets/SAT.jpg";
// import MATImage from "../assets/MAT.jpg";
// import { Link } from "react-router-dom";

// const Course = () => {
//   return (
//     <div className="relative min-h-screen">
//       <Header />
      
//       {/* Main Content with adjusted padding */}
//       <main className="container mx-auto px-4 pb-20 md:pb-8 pt-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
//         <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Study Materials</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
//           {/* SAT Book */}
//           <div className="bg-white p-3 md:p-15 shadow-md text-center rounded-lg">
//             <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">Scholastic Aptitude Test (SAT)</h3>
//             <Link to="/sat" className="block">
//               <img
//                 src={SATImage}
//                 alt="SAT Book"
//                 className="w-40 md:w-60 h-auto mx-auto mb-4 transform hover:scale-105 transition duration-30"
//               />
//             </Link>
//           </div>

//           {/* MAT Book */}
//           <div className="bg-white p-3 md:p-15 shadow-md text-center rounded-lg">
//             <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">Mental Ability Test (MAT)</h3>
//             <Link to="/mat" className="block">
//               <img
//                 src={MATImage}
//                 alt="MAT Book"
//                 className="w-40 md:w-60 h-auto mx-auto mb-4 transform hover:scale-105 transition duration-30"
//               />
//             </Link>
//           </div>
//         </div>
//       </main>

//       {/* Footer - Only shown on desktop */}
//       <footer className="hidden md:block bg-gray-800 text-white text-center p-4 mt-8">
//         <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Course;