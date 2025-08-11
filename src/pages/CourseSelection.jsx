import { useState } from "react";
import Header from "../components/Header";
import { ArrowLeftRight, Check, ArrowRight, Zap, Award, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CourseSelection = () => {
  const [language, setLanguage] = useState("mr");
  const navigate = useNavigate();

  const content = {
    mr: {
      title: "कोर्स निवडा",
      freeCourseTitle: "मोफत कोर्स",
      masterTestTitle: "मास्टर टेस्ट",
      freeTag: "मोफत",
      paidTag: "प्रीमियम",
      freeAdvantages: [
        "परिपूर्ण व्हिडिओ लेक्चर",
        "1000 प्रश्नांचा समावेश",
        "मूलभूत संकल्पनांचे शिक्षण",
        "नमुना प्रश्नांचा सराव",
      ],
      masterTestAdvantages: [
        "100 Online Test",
        "6000+ प्रश्नांचा समावेश",
        "प्रकरणाच्या भारांशानुसार प्रश्न संख्या",
        // "प्रत्येक टेस्ट नंतर त्वरित निकाल",
        "मराठी व सेमी इंग्रजीत टेस्ट उपलब्ध",
        "एक टेस्ट तीन वेळा सोडवता येईल",
        "अंतिम परीक्षेला 130+ गुणांसाठी बक्षीस",    
      ],
      goToCourse: "कोर्सवर जा",
      buyNow: "6000+ प्रश्नांसाठी येथे क्लिक करा",
      // buyNow: "आजच परीक्षेसाठी तयार व्हा!", 
    },
    en: {
      title: "Choose Your Course",
      freeCourseTitle: "Free Course",
      masterTestTitle: "Master Test",
      freeTag: "Free",
      paidTag: "Premium",
      freeAdvantages: [
        "Video lectures",
        "1000 Sample Questions",
        "Preliminary guidance",
        "Sample question practice",
      ],
      masterTestAdvantages: [
        "100 Online Test",
        "6000+ Practice Questions",
        "Complete test on all subjects",
        "Full access to all questions",
        "3 Attempts per test",
        "Prize For 130+ marks in Final Exam"  
      ],
      goToCourse: "Go to Course",
      buyNow: "Unlock 6000+ Questions",
      //buyNow: "Get Exam-Ready Today!",
    },
  };

  const t = content[language];

  const handleBuyNow = () => {
    navigate('/payment');
  };

 return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
    <Header className="max-md:h-16" /> {/* Compact header for mobile */}

    <main className="flex-grow container mx-auto px-4 max-md:px-3 py-8 md:py-12 pb-20 max-md:pb-18">
      <div className="max-w-4xl mx-auto">
        {/* Header section - compact for mobile */}
        <div className="relative mb-10 max-md:mb-6 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl md:text-4xl max-md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            {t.title}
          </motion.h1>
          
          <motion.button
            onClick={() => setLanguage(prev => prev === "mr" ? "en" : "mr")}
            whileHover={{ scale: 1.1 }}
            className="absolute top-0 right-0 flex items-center gap-1 px-3 py-1.5 max-md:px-2 max-md:py-1 bg-white border border-blue-200 text-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all text-sm max-md:text-xs hover:bg-blue-50"
          >
            <ArrowLeftRight size={14} className="max-md:w-3 max-md:h-3" />
            <span className="font-medium">{language === "mr" ? "EN" : "मरा"}</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-md:gap-4">
          {/* Free Course Box - compact for mobile */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-md:min-h-0"
          >
            <div className="p-6 md:p-7 max-md:p-4 flex flex-col flex-grow">
              {/* Tag - smaller on mobile */}
              <div className="absolute top-4 right-4 max-md:top-2 max-md:right-2 bg-emerald-500 text-white text-xs max-md:text-[0.65rem] font-bold px-3 py-1 max-md:px-2 max-md:py-0.5 rounded-md shadow-md">
                {t.freeTag}
              </div>
              
              {/* Content - compact for mobile */}
              <div className="flex items-center gap-3 mb-5 max-md:mb-3">
                <div className="p-2 max-md:p-1.5 bg-emerald-100 rounded-lg">
                  <Zap className="text-emerald-600 w-6 h-6 max-md:w-5 max-md:h-5" />
                </div>
                <h3 className="text-2xl max-md:text-xl font-bold text-gray-800">{t.freeCourseTitle}</h3>
              </div>
              
              <ul className="space-y-3 max-md:space-y-2 mb-6 max-md:mb-4">
                {t.freeAdvantages.map((advantage, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-start"
                  >
                    <span className="bg-emerald-100 p-1.5 max-md:p-1 rounded-full mr-3 max-md:mr-2 flex-shrink-0">
                      <Check className="text-emerald-600 w-4 h-4 max-md:w-3 max-md:h-3" />
                    </span>
                    <span className="text-gray-700 font-semibold max-md:text-sm">{advantage}</span>
                  </motion.li>
                ))}
              </ul>
              
              {/* Button - smaller on mobile */}
              <div className="mt-auto pt-4 max-md:pt-2">
                {/* For the Free Course Button */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/course"
                  className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium px-4 py-2.5 max-md:px-3 max-md:py-2 rounded-lg shadow-md transition-all text-sm"
                >
                  {t.goToCourse}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
              </div>
            </div>
            
            {/* Bottom border */}
            <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-400 w-full"></div>
          </motion.div>

          {/* Master Test Box - compact for mobile */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-md:min-h-0"
          >
            <div className="p-6 md:p-7 max-md:p-4 flex flex-col flex-grow">
              {/* Price tag - smaller on mobile */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 right-4 max-md:top-2 max-md:right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-3 py-1 max-md:px-2 max-md:py-0.5 rounded-md shadow-lg z-10 flex items-center text-sm max-md:text-xs"
              >
                ₹149/-
              </motion.div>

              {/* Tag - smaller on mobile */}
              <div className="absolute top-4 left-4 max-md:top-2 max-md:left-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs max-md:text-[0.65rem] font-bold px-3 py-1 max-md:px-2 max-md:py-0.5 rounded-md shadow-md">
                {t.paidTag}
              </div>
              
              {/* Content - compact for mobile */}
              <div className="flex items-center gap-3 mb-5 max-md:mb-3 mt-2">
                <div className="p-2 max-md:p-1.5 bg-indigo-100 rounded-lg">
                  <Award className="text-indigo-600 w-6 h-6 max-md:w-5 max-md:h-5" />
                </div>
                <h3 className="text-2xl max-md:text-xl font-bold text-gray-800">{t.masterTestTitle}</h3>
              </div>
              
              <ul className="space-y-3 max-md:space-y-2 mb-6 max-md:mb-4">
                {t.masterTestAdvantages.map((advantage, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-start"
                  >
                    <span className="bg-indigo-100 p-1.5 max-md:p-1 rounded-full mr-3 max-md:mr-2 flex-shrink-0">
                      <Check className="text-indigo-600 w-4 h-4 max-md:w-3 max-md:h-3" />
                    </span>
                    <span className="text-gray-700 font-semibold max-md:text-sm">{advantage}</span>
                  </motion.li>
                ))}
              </ul>
              
              {/* Bouncy Buy Now button - adjusted for mobile */}
              <div className="mt-auto pt-4 max-md:pt-2">
                {/* For the Master Test Button */}
                <motion.button
                  onClick={handleBuyNow}
                  whileHover={{ 
                    scale: 1.05,
                    y: -3
                  }}
                  whileTap={{ 
                    scale: 0.95
                  }}
                  animate={{
                    y: [0, -10, 0], // Reduced bounce height
                    transition: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 1,
                      ease: "easeInOut"
                    }
                  }}
                  className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-4 py-2.5 max-md:px-3 max-md:py-2 rounded-lg shadow-md transition-all relative overflow-hidden group text-sm"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full"></span>
                  {t.buyNow}
                  <Clock className="w-3.5 h-3.5" />
                </motion.button>

              </div>
            </div>
            
            {/* Bottom border */}
            <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 w-full"></div>
          </motion.div>
        </div>

        {/* Footer - smaller on mobile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 max-md:mt-8 text-center text-gray-500 text-sm max-md:text-xs"
        >
          {language === "mr" ? "तुमच्या यशासाठी शुभेच्छा!" : "Wishing you success!"}
        </motion.div>
      </div>
    </main>
  </div>
);
};

export default CourseSelection;



// import { useState } from "react";
// import Header from "../components/Header";
// import { ArrowLeftRight, Check, ArrowRight } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const CourseSelection = () => {
//   const [language, setLanguage] = useState("mr");
//   const navigate = useNavigate();

//   const content = {
//     mr: {
//       title: "कोर्स निवडा",
//       freeCourseTitle: "मोफत कोर्स",
//       masterTestTitle: "मास्टर टेस्ट",
//       freeTag: "मोफत",
//       paidTag: "प्रीमियम",
//       freeAdvantages: [
//         "परिपूर्ण व्हिडिओ लेक्चर",
//         "1000 प्रश्नांचा समावेश",
//         "मूलभूत संकल्पनांचे शिक्षण",
//         "नमुना प्रश्नांचा सराव",
//       ],
//       masterTestAdvantages: [
//         // "मोफत कोर्स",
//         // "+",
//         "100 Online Test",
//         "6000+ प्रश्नांचा समावेश",
//         "प्रकरणाच्या भारांशानुसार प्रश्न संख्या",
//         "प्रत्येक टेस्ट नंतर त्वरित निकाल",
//         "एक टेस्ट तीन वेळा सोडवता येईल",
//         "अंतिम परीक्षेला 130+ गुणांसाठी बक्षीस",    
//       ],
//       goToCourse: "कोर्सवर जा",
//       buyNow: "आताच खरेदी करा",
//     },
//     en: {
//       title: "Choose Your Course",
//       freeCourseTitle: "Free Course",
//       masterTestTitle: "Master Test",
//       freeTag: "Free",
//       paidTag: "Premium",
//       freeAdvantages: [
//         "Video lectures",
//         "1000 Sample Questions",
//         "Preliminary guidance",
//         "Sample question practice",
//       ],
//       masterTestAdvantages: [
//         "Free Course",
//         "+",
//         "100 Online Test",
//         "6000+ Practice Questions",
//         "Complete test on all subjects",
//         "Full access to all questions",
//         "3 Attempts per test",
//         "Prize For 130+ marks in Final Exam"  
//       ],
//       goToCourse: "Go to Course",
//       buyNow: "Buy Now",
//     },
//   };

//   const t = content[language];

//   const handleBuyNow = () => {
//     navigate('/payment');
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-white">
//       <Header />

//       <main className="flex-grow container mx-auto px-4 py-8 md:py-12 pb-20">
//         <div className="max-w-4xl mx-auto">
//           {/* Language Toggle */}
//           <div className="flex justify-end mb-6">
//             <button
//               onClick={() => setLanguage(prev => prev === "mr" ? "en" : "mr")}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-400 text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-all"
//             >
//               <ArrowLeftRight size={16} />
//               <span className="font-medium">{language === "mr" ? "English" : "मराठी"}</span>
//             </button>
//           </div>

//           <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t.title}</h1>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Free Course Box */}
//             <div className="bg-white rounded-xl shadow-lg p-6 relative border-2 border-emerald-200 hover:border-emerald-300 transition-all">
//               <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
//                 {t.freeTag}
//               </span>
//               <h3 className="text-2xl font-bold text-emerald-700 mb-5">{t.freeCourseTitle}</h3>
              
//               <ul className="space-y-3 mb-8">
//                 {t.freeAdvantages.map((advantage, index) => (
//                   <li key={index} className="flex items-start">
//                     <span className="bg-emerald-100 p-1 rounded-full mr-3">
//                       <Check className="text-emerald-600 w-4 h-4" />
//                     </span>
//                     <span className="text-gray-700 font-medium">{advantage}</span>
//                   </li>
//                 ))}
//               </ul>
              
//               <Link
//                 to="/course"
//                 className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
//               >
//                 {t.goToCourse}
//                 <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>

//             {/* Master Test Box */}
//             <div className="bg-white rounded-xl shadow-lg p-6 relative border-2 border-indigo-200 hover:border-indigo-300 transition-all">
//               {/* Flashy Price Badge */}
//               <motion.div
//                 initial={{ scale: 1 }}
//                 animate={{ scale: [1, 1.1, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//                 className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-4 py-1 rounded-full shadow-lg z-10 flex items-center"
//               >
//                 <span className="text-sm">₹149/-</span>
//               </motion.div>

//               <span className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
//                 {t.paidTag}
//               </span>
//               <h3 className="text-2xl font-bold text-indigo-700 mb-5">{t.masterTestTitle}</h3>
              
//               <ul className="space-y-3 mb-8">
//                 {t.masterTestAdvantages.map((advantage, index) => (
//                   <li key={index} className="flex items-start">
//                     {advantage === "+" ? (
//                       <div className="w-full text-center my-2">
//                         <span className="text-2xl font-bold text-indigo-600">+</span>
//                       </div>
//                     ) : (
//                       <>
//                         <span className="bg-indigo-100 p-1 rounded-full mr-3">
//                           <Check className="text-indigo-600 w-4 h-4" />
//                         </span>
//                         <span className="text-gray-700 font-medium">{advantage}</span>
//                       </>
//                     )}
//                   </li>
//                 ))}
//               </ul>
              
//               <motion.button
//                 onClick={handleBuyNow}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full md:w-auto md:px-8 flex items-center justify-center animate-bounce hover:animate-none  gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-md transition-all mx-auto"
//               >
//                 {t.buyNow}
//                 <ArrowRight className="w-4 h-4" />
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default CourseSelection;