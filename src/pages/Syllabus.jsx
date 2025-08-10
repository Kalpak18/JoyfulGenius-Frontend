// src/pages/Syllabus.jsx
import { useState } from "react";
import Header from "../components/Header";
import syllabuspage from "../assets/Syllabus_page-0001.jpg";

const Syllabus = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // YouTube video details
  const videoId = "I56TG-lSepQ";
  const youtubeThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const youtubeEmbed = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Syllabus & Exam Pattern
        </h2>

        {/* Video Section */}
        <div className="video mb-8 text-center cursor-pointer">
          <div
            onClick={() => setIsModalOpen(true)}
            className="border-4 border-blue-500 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <img
              src={youtubeThumbnail}
              alt="Watch the Syllabus Video"
              className="w-full max-w-2xl mx-auto"
            />
          </div>
          <p className="text-red-600 font-semibold mt-2 max-w-2xl mx-auto">
            NMMS परीक्षा संपूर्ण माहिती , कोटा व लागणारी कागदपत्रे याबद्दल संक्षिप्त स्वरूपात
            माहिती साठी फोटो वर क्लिक करा !!
          </p>
        </div>

        {/* Syllabus Section */}
        <div className="syllabus-screenshot bg-white p-6 rounded-lg shadow-md max-w-2xl w-full text-center">
          <h3 className="text-2xl font-bold mb-4">NMMS Syllabus</h3>
          <p className="mb-4">
            राष्ट्रीय आर्थिक दुर्बल घटक विद्यार्थ्यांसाठी शिष्यवृत्ती योजना परीक्षा (NMMS)
          </p>
          <img
            src={syllabuspage}
            alt="Read the syllabus"
            className="w-full max-w-4xl mx-auto"
          />
          <p className="mb-4">
            For more detailed information, you can download the complete guide below:
          </p>
          <a
            href="../src/assets/information2324.pdf"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
        </div>
      </main>

      {/* Video Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
          onClick={closeModal} // Close when clicking outside
        >
          <div
            className="relative bg-black rounded-lg shadow-lg w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
          >
            <iframe
              width="100%"
              height="100%"
              src={youtubeEmbed}
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-white text-black rounded-full p-2 hover:bg-red-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Syllabus;
