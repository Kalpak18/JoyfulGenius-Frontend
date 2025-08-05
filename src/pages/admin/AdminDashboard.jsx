// // src/pages/admin/AdminDashboard.jsx
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) {
//       navigate("/admin/login");
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
//       <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
//         <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Admin Dashboard</h2>
//         <div className="space-y-4">
//           <button
//             onClick={() => navigate("/admin/users")}
//             className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg text-lg"
//           >
//             View Users
//           </button>
//           <button
//             onClick={() => navigate("/admin/questions")}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-lg"
//           >
//             Manage Quiz Questions
//           </button>
//           <button
//             onClick={() => navigate("/admin/upload-material")}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-lg"
//           >
//             Upload Material
//           </button>
//           <button
//             onClick={() => navigate("/admin/stats")}
//             className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-lg"
//           >
//             Analytics
//           </button>
//           <button
//             onClick={handleLogout}
//             className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg text-lg"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// src/pages/admin/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Admin Dashboard</h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg text-lg"
            >
              View Users
            </button>
            <button
              onClick={() => navigate("/admin/questions")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-lg"
            >
              Manage Quiz Questions
            </button>
            <button
              onClick={() => navigate("/admin/upload-material")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-lg"
            >
              Upload Material
            </button>
            <button
              onClick={() => navigate("/admin/upload-chapter")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-lg"
            >
              Chapter Managemment
            </button>
            <button
              onClick={() => navigate("/admin/stats")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-lg"
            >
              Analytics
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg text-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
