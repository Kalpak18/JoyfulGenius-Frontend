import { useState } from "react";
import Header from "../components/Header";
import qrCode from "../assets/Payment_Only_QR.jpg";
import { ArrowLeftRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentPage = () => {
  const [language, setLanguage] = useState("mr");
  const location = useLocation();
  const showEnrolledMsg = location.state?.enrolled;

  const content = {
    mr: {
      title: "मास्टर टेस्टसाठी पेमेंट करा",
      paymentInfo: "पेमेंट माहिती",
      upiText: "QR कोड स्कॅन करा किंवा पेमेंट पाठवा:",
      upiId: "joyfulgenius@axl",
      coursePrice: "कोर्स शुल्क: ₹149/-",
      afterPayment: "पेमेंट झाल्यानंतर कृपया UPI संदर्भ क्रमांक किंवा स्क्रीनशॉट WhatsApp वर पाठवा:",
      whatsAppButton: "WhatsApp वर पाठवा",
      waitMsg: "कृपया प्रशासक पेमेंटची पुष्टी करेपर्यंत प्रतीक्षा करा (जास्तीत जास्त ६ तास)",
      screenshotMsg: "कृपया स्क्रीनशॉटसोबत आपले नाव नोंदणी केलेले नाव पाठवा",
      goBack: "मागे जा",
      goToCourse: "कोर्सवर जा",
      enrolledMsg: "🎉 आपण यशस्वीरित्या कोर्समध्ये नाव नोंदणी केली आहे!",
    },
    en: {
      title: "Payment for Master Test",
      paymentInfo: "Payment Information",
      upiText: "Scan the QR code or send payment to:",
      upiId: "joyfulgenius@axl",
      coursePrice: "Course Price: ₹149/-",
      afterPayment: "After payment, please send the UPI reference number or screenshot on WhatsApp:",
      whatsAppButton: "Send on WhatsApp",
      waitMsg: "Please wait until the admin confirms your payment (maximum 6 hours)",
      screenshotMsg: "Please send screenshot along with your registered name",
      goBack: "Go Back",
      goToCourse: "Go to Course",
      enrolledMsg: "🎉 You've successfully enrolled in the course!",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="relative bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <Link to="/course-selection" className="flex items-center">
            <ArrowLeft size={20} className="text-gray-600 mr-1" />
            <span className="text-sm font-medium text-gray-700">{t.goBack}</span>
          </Link>

          <button
            onClick={() => setLanguage(prev => prev === "mr" ? "en" : "mr")}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-100 text-blue-600 rounded-full shadow-sm hover:bg-blue-50 transition-all text-sm font-medium"
          >
            <ArrowLeftRight size={14} className="text-blue-500" />
            <span>{language === "mr" ? "EN" : "मर"}</span>
          </button>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          {showEnrolledMsg && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mb-5 bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-3 rounded-xl shadow text-center"
            >
              <p className="font-medium">{t.enrolledMsg}</p>
            </motion.div>
          )}

          <h1 className="text-2xl font-bold text-center mb-5 text-gray-800">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-center mb-6"
          >
            <div className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold px-5 py-2 rounded-full shadow-lg">
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="block"
              >
                {t.coursePrice}
              </motion.span>
            </div>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            <h2 className="text-lg font-bold text-center mb-4 text-gray-800 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {t.paymentInfo}
            </h2>

            {/* ✅ PROTECTED QR Code */}
            <div className="my-4 border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col items-center">
              <img
                src={qrCode}
                alt="UPI QR Code"
                onContextMenu={(e) => e.preventDefault()}
                className="w-40 mx-auto mb-3 rounded-lg select-none pointer-events-none"
              />
              <p className="text-sm text-gray-600 mt-2">{t.upiText}</p>
              <p className="text-base font-mono font-bold text-blue-600 mt-1 bg-blue-50 px-3 py-1 rounded">
                {t.upiId}
              </p>
            </div>

            <p className="text-sm text-gray-700 mb-5 text-center">
              {t.afterPayment}
              <br />
              <span className="font-medium text-indigo-600 mt-1 inline-block">
                {t.screenshotMsg}
              </span>
            </p>

            <div className="flex flex-col space-y-3">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/918766716546"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-6 py-2.5 rounded-xl shadow transition-all relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 fill-current mr-2" viewBox="0 0 24 24">
                    <path d="... (whatsapp icon path) ..." />
                  </svg>
                  {t.whatsAppButton}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.a>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/course"
                  className="block text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium px-6 py-2.5 rounded-xl shadow transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    {t.goToCourse}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </motion.div>

              <div className="mt-4 text-gray-600 text-xs text-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.waitMsg}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentPage;
