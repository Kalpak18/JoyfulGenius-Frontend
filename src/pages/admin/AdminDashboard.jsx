// src/pages/admin/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../../utils/axios";
import useAuth from "../../hooks/useAuth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ reuse logout from context

  // ❌ Redundant token check removed — PrivateAdminRoute already protects this page

  const handleLogout = async () => {
    try {
      const role =
        localStorage.getItem("role") || sessionStorage.getItem("role");
      const endpoint = role === "admin" ? "/admin/logout" : "/users/logout";

      await api.post(endpoint, {}, { withCredentials: true });
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error("❌ Logout API failed", err);
    } finally {
      logout(); // ✅ single source of truth
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
            Admin Dashboard
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/admin/create")}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg text-lg"
            >
              Create Course
            </button>
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
              Chapter Management
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
