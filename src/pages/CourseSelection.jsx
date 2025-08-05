import { useState } from "react";
import Header from "../components/Header";
import { ArrowLeftRight, Check, ArrowRight } from "lucide-react";
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
        "मोफत कोर्स",
        "+",
        "100 Online Test",
        "6000+ प्रश्नांचा समावेश",
        "प्रकरणाच्या भारांशानुसार प्रश्न संख्या",
        "प्रत्येक टेस्ट नंतर त्वरित निकाल",
        "एक टेस्ट तीन वेळा सोडवता येईल",
        "अंतिम परीक्षेला 130+ गुणांसाठी बक्षीस",    
      ],
      goToCourse: "कोर्सवर जा",
      buyNow: "आताच खरेदी करा",
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
        "Free Course",
        "+",
        "100 Online Test",
        "6000+ Practice Questions",
        "Complete test on all subjects",
        "Full access to all questions",
        "3 Attempts per test",
        "Prize For 130+ marks in Final Exam"  
      ],
      goToCourse: "Go to Course",
      buyNow: "Buy Now",
    },
  };

  const t = content[language];

  const handleBuyNow = () => {
    navigate('/payment');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setLanguage(prev => prev === "mr" ? "en" : "mr")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-400 text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-all"
            >
              <ArrowLeftRight size={16} />
              <span className="font-medium">{language === "mr" ? "English" : "मराठी"}</span>
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t.title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Free Course Box */}
            <div className="bg-white rounded-xl shadow-lg p-6 relative border-2 border-emerald-200 hover:border-emerald-300 transition-all">
              <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {t.freeTag}
              </span>
              <h3 className="text-2xl font-bold text-emerald-700 mb-5">{t.freeCourseTitle}</h3>
              
              <ul className="space-y-3 mb-8">
                {t.freeAdvantages.map((advantage, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-emerald-100 p-1 rounded-full mr-3">
                      <Check className="text-emerald-600 w-4 h-4" />
                    </span>
                    <span className="text-gray-700 font-medium">{advantage}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                to="/course"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
              >
                {t.goToCourse}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Master Test Box */}
            <div className="bg-white rounded-xl shadow-lg p-6 relative border-2 border-indigo-200 hover:border-indigo-300 transition-all">
              {/* Flashy Price Badge */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-4 py-1 rounded-full shadow-lg z-10 flex items-center"
              >
                <span className="text-sm">₹149/-</span>
              </motion.div>

              <span className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {t.paidTag}
              </span>
              <h3 className="text-2xl font-bold text-indigo-700 mb-5">{t.masterTestTitle}</h3>
              
              <ul className="space-y-3 mb-8">
                {t.masterTestAdvantages.map((advantage, index) => (
                  <li key={index} className="flex items-start">
                    {advantage === "+" ? (
                      <div className="w-full text-center my-2">
                        <span className="text-2xl font-bold text-indigo-600">+</span>
                      </div>
                    ) : (
                      <>
                        <span className="bg-indigo-100 p-1 rounded-full mr-3">
                          <Check className="text-indigo-600 w-4 h-4" />
                        </span>
                        <span className="text-gray-700 font-medium">{advantage}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              
              <motion.button
                onClick={handleBuyNow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto md:px-8 flex items-center justify-center animate-bounce hover:animate-none  gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-md transition-all mx-auto"
              >
                {t.buyNow}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseSelection;