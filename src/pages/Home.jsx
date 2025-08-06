
// // src/pages/Home.jsx
// import Header from '../components/Header';
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const navigate = useNavigate();

// useEffect(() => {
//   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//   const isPaidUser = localStorage.getItem("isPaidUser");

//   if (token) {
//     navigate(isPaidUser === "true" ? "/course" : "/enroll");
//   }
// }, []);


//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
//       <Header />

//       {/* Main Content */}
//       <main className="flex-grow flex flex-col items-center justify-center px-4 py-3 md:py-6 mt-4 md:mt-0">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-5xl mb-24 md:mb-0">
//           {/* Section 1 */}
//           <div className="bg-white p-4 md:p-6 rounded-lg shadow flex flex-col text-sm md:text-base">
//             <h2 className="text-lg md:text-2xl font-bold mb-2 text-blue-800">
//               NMMS मोफत ऑनलाईन मार्गदर्शन व मॉक टेस्ट
//             </h2>
//             <p className="mb-2">MAT (बौद्धिक क्षमता चाचणी) व SAT (शालेय क्षमता चाचणी)</p>
//             <ul className="list-inside space-y-1">
//               <li>🔴 100 दिवसांचा वेळापत्रकानुसार मोफत कोर्स</li>
//               <li>🟡 180 गुणांचे परिपूर्ण ऑनलाईन तास</li>
//               <li>🟣 त्वरित निकाल देणारी 10 गुणांची Online Test</li>
//               <li>🟤 अंतिम परीक्षेच्या भारांशानुसार प्रकरणाला महत्त्व</li>
//               <li>🔵 विज्ञानाच्या अवघड संकल्पना प्रयोगातून स्पष्ट</li>
//               <li>🟢 विद्यार्थ्यांमध्ये प्रश्न निर्मितीसाठी कौशल्य</li>
//               <li>🔴 Online Test मराठी व सेमी इंग्रजीत उपलब्ध</li>
//             </ul>
//           </div>

//           {/* Section 2 */}
//           <div className="bg-white p-4 md:p-6 rounded-lg shadow flex flex-col text-sm md:text-base">
//             <h2 className="text-lg md:text-2xl font-bold mb-2 text-blue-800">
//               NMMS Online Test Series
//             </h2>
//             <p className="mb-2">MAT (बौद्धिक क्षमता चाचणी) व SAT (शालेय क्षमता चाचणी)</p>
//             <ul className="list-inside space-y-1">
//               <li>🟡 100 टेस्टमध्ये 6000 प्रश्नांचा संग्रह</li>
//               <li>🟢 अंतिम परीक्षेनुसार 2 MAT व 2 SAT टेस्ट</li>
//               <li>🔴 प्रकरणाच्या भारांशानुसार प्रश्न संख्या</li>
//               <li>🔵 अंतिम परीक्षेच्या संभाव्य भरपूर प्रश्नांचा समावेश</li>
//               <li>🟢 नोव्हेंबर मध्ये रिव्हिजन साठी पुन्हा टेस्ट उपलब्ध</li>
//               <li>🟣 विज्ञान व गणित मराठी व सेमी इंग्रजीत उपलब्ध</li>
//               <li>🟠 प्रत्येक टेस्टनंतर त्वरित निकाल व Remark</li>
//               <li>🔴 वेळापत्रकानुसार 180 गुणांचे फ्री लेक्चर</li>
//               <li>🟢 टेस्टनंतर 5 विद्यार्थ्यांची गुणाानुक्रम यादी</li>
//               <li>🔵 Test किंमत 170/- (सॉफ्टवेअर + Typing)</li>
//             </ul>
//           </div>
//         </div>
//       </main>
//       {/* Enroll Button - Fixed above nav on mobile, static on desktop */}
//       <div className="relative bottom-24 left-0 w-full text-center z-40 md:static md:bottom-auto md:py-6">
//         <a
//           href="/enroll"
//           className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow transition inline-block mb-2"
//         >
//           Enroll Now
//         </a>
//       </div>


//       {/* Footer */}
//       <footer className="bg-gray-800 text-white text-center p-3">
//         <p className="text-sm">&copy; 2024 NMMS Prep. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;


// src/pages/Home.jsx
// import Header from '../components/Header';
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//   //   // const isPaidUser = localStorage.getItem("isPaidUser");
//   //    navigate(token ? "/course" : "/");
//   // }, []);

//   // useEffect(() => {
//   //   const adminToken = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
//   //   // const isPaidUser = localStorage.getItem("isPaidUser");
//   //    navigate(adminToken ? "/admin/dashboard" : "/");
//   // }, []);


//   useEffect(() => {
//   const adminToken = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
//   const userToken = localStorage.getItem("token") || sessionStorage.getItem("token");

//   if (adminToken) {
//     navigate("/admin/dashboard");
//   } else if (userToken) {
//     navigate("/course");
//   }
//   // else don't navigate, stay on home
// }, []);


//   const features = [
//     {
//       title: "100 दिवसांचा मोफत कोर्स",
//       color: "bg-gradient-to-r from-red-400 to-pink-500",
//       emoji: "📅",
//       hover: "hover:shadow-red-200"
//     },
//     {
//       title: "100 परिपूर्ण ऑनलाईन तास",
//       color: "bg-gradient-to-r from-amber-400 to-yellow-500",
//       emoji: "🎓",
//       hover: "hover:shadow-yellow-200"
//     },
//     {
//       title: "100 टेस्ट, 1000+ प्रश्न",
//       color: "bg-gradient-to-r from-orange-400 to-red-500",
//       emoji: "📝",
//       hover: "hover:shadow-orange-200"
//     },
//     {
//       title: "त्वरित निकाल देणारी टेस्ट",
//       color: "bg-gradient-to-r from-purple-400 to-indigo-500",
//       emoji: "⚡",
//       hover: "hover:shadow-purple-200"
//     },
//     {
//       title: "प्रकरणाला महत्त्व दिलेले",
//       color: "bg-gradient-to-r from-blue-400 to-cyan-500",
//       emoji: "📊",
//       hover: "hover:shadow-blue-200"
//     },
    
//     //  {
//     //   title: "प्रकरणाच्या भारांशानुसार प्रश्न संख्या",
//     //   color: "bg-gradient-to-r from-green-400 to-teal-500",
//     //   // link: "/science",
//     //   emoji: "🧪",
//     //   hover: "hover:shadow-green-200"
//     // },
//     // {
//     //   title: "विज्ञान-गणित मराठी व सेमी इंग्रजीत",
//     //   color: "bg-gradient-to-r from-indigo-400 to-violet-500",
//     //   emoji: "🌐",
//     //   hover: "hover:shadow-indigo-200"
//     // },
//     {
//       title: "एक टेस्ट तीन वेळा सोडवता येईल",
//       color: "bg-gradient-to-r from-pink-400 to-rose-500",
//       emoji: "💲",
//       hover: "hover:shadow-pink-200"
//     }
//   ];

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50">
//       <Header />

//       {/* Main Content */}
//       <main className="flex-grow px-4 py-6">
//         <div className="max-w-3xl mx-auto">
//           <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
//             NMMS मोफत ऑनलाईन मार्गदर्शन व मॉक टेस्ट
//           </h1>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             {features.map((feature, index) => (
//               <a 
//                 key={index}
//                 href={feature.link}
//                 className={`${feature.color} ${feature.hover} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex items-center text-white font-medium`}
//               >
//                 <span className="text-3xl mr-4 drop-shadow-md">{feature.emoji}</span>
//                 <span className="text-lg drop-shadow-md">{feature.title}</span>
//               </a>
//             ))}
//           </div>

//           <div className="mt-12 text-center animate-bounce hover:animate-none">
//             <a
//               href="/enroll"
//               className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-10 py-5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-xl"
//             >
//               Enroll Now 
//             </a>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center p-4 mt-12">
//         <p className="text-sm">&copy; 2024 NMMS Prep. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;

import Header from '../components/Header';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth'; // ✅ Import the hook

const Home = () => {
  const navigate = useNavigate();
  const { isUser, isAdmin } = useAuth(); // ✅ Destructure auth status

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else if (isUser) {
      navigate("/course");
    }
    // else remain on home
  }, [isUser, isAdmin, navigate]);

  const features = [
    {
      title: "100 दिवसांचा मोफत कोर्स",
      color: "bg-gradient-to-r from-red-400 to-pink-500",
      emoji: "📅",
      hover: "hover:shadow-red-200"
    },
    {
      title: "100 परिपूर्ण ऑनलाईन तास",
      color: "bg-gradient-to-r from-amber-400 to-yellow-500",
      emoji: "🎓",
      hover: "hover:shadow-yellow-200"
    },
    {
      title: "100 टेस्ट, 1000+ प्रश्न",
      color: "bg-gradient-to-r from-orange-400 to-red-500",
      emoji: "📝",
      hover: "hover:shadow-orange-200"
    },
    {
      title: "त्वरित निकाल देणारी टेस्ट",
      color: "bg-gradient-to-r from-purple-400 to-indigo-500",
      emoji: "⚡",
      hover: "hover:shadow-purple-200"
    },
    {
      title: "प्रकरणाला महत्त्व दिलेले",
      color: "bg-gradient-to-r from-blue-400 to-cyan-500",
      emoji: "📊",
      hover: "hover:shadow-blue-200"
    },
    {
      title: "एक टेस्ट तीन वेळा सोडवता येईल",
      color: "bg-gradient-to-r from-pink-400 to-rose-500",
      emoji: "💲",
      hover: "hover:shadow-pink-200"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50">
      <Header />

      {/* Main Content */}
      <main className="flex-grow px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
            NMMS मोफत ऑनलाईन मार्गदर्शन व मॉक टेस्ट
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <a 
                key={index}
                href={feature.link || "#"}
                className={`${feature.color} ${feature.hover} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex items-center text-white font-medium`}
              >
                <span className="text-3xl mr-4 drop-shadow-md">{feature.emoji}</span>
                <span className="text-lg drop-shadow-md">{feature.title}</span>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center animate-bounce hover:animate-none">
            <a
              href="/enroll"
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-10 py-5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-xl"
            >
              Enroll Now 
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center p-4 mt-12">
        <p className="text-sm">&copy; 2024 NMMS Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
