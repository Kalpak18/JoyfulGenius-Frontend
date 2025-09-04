import Header from "../../components/Header";
import { Link } from "react-router-dom";

const Science = () => {
  const subjects = [
    { name: "Physics", route: "/dynamic/physics" },
    { name: "Chemistry", route: "/dynamic/chemistry" },
    { name: "Biology", route: "/dynamic/biology" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-10 flex-grow">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-700">
          🔬 Science Subjects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {subjects.map((subj, index) => (
            <Link
              key={index}
              to={subj.route}
              className="bg-white border shadow-lg rounded-xl py-8 px-4 hover:bg-green-100 transition-all text-xl font-semibold text-green-800"
            >
              {subj.name}
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Science;
