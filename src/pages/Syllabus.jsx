// src/pages/Syllabus.jsx
import Header from "../components/Header";
import syllabusImage from "../assets/screenshot(134).jpg"; // Import the image
import syllabuspage from "../assets/Syllabus_page-0001.jpg";
// import syllabuspdf from "../assets/information2324.pdf";

const Syllabus = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Syllabus & Exam Pattern</h2>

        {/* Video Section */}
        <div className="video mb-8 text-center">
          <a
            href="https://youtu.be/I56TG-lSepQ?si=xCExlDcrzy8VHj2Z"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={syllabusImage} // Use the imported image
              alt="Watch the Syllabus Video"
              className="w-full max-w-2xl rounded-lg shadow-md mx-auto"
            />
            <p className="text-red-600 font-semibold mt-2">
              NMMS परीक्षा संपूर्ण माहिती , कोटा व लागणारी कागदपत्रे याबद्दल संक्षिप्त स्वरूपात माहिती साठी फोटो वर क्लिक करा !!
            </p>
          </a>
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

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Syllabus;