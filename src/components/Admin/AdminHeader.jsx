import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/axios";
import useAuth from "../../hooks/useAuth"; // ✅ import

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth(); // ✅ use central logout

  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout", {}, { withCredentials: true });
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.error("❌ Admin Logout API failed", err);
    } finally {
      logout(); // ✅ clear tokens/session safely
      navigate("/admin/login", { replace: true }); // ✅ always send to admin login
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { path: "/admin/create", label: "Create" },
    { path: "/admin/upload-chapter", label: "Chapter" },
    { path: "/admin/questions", label: "Questions" },
    { path: "/admin/upload-material", label: "Materials" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/stats", label: "Stats" },
  ];

  return (
    <>
      {/* Header Bar */}
      <header className="w-full bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-lg px-4 py-3 flex justify-between items-center z-50 sticky top-0">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </motion.button>
          )}
          <motion.h1
            className="text-lg md:text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Admin Panel
          </motion.h1>
        </div>
        <motion.button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-sm md:text-base text-white px-4 py-2 rounded-lg shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </header>

      {/* Desktop Navigation */}
      {!isMobile && (
        <motion.nav
          className="bg-white border-b flex justify-center space-x-6 py-3 shadow-sm sticky top-16 z-40"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm font-medium px-3 py-1 rounded-md transition-all ${
                location.pathname.includes(item.path.split("/")[2])
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </motion.nav>
      )}

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.nav
            className="bg-gradient-to-b from-indigo-700 to-purple-800 shadow-xl fixed top-16 left-0 right-0 z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col divide-y divide-indigo-600">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-6 py-4 text-left text-white font-medium ${
                    location.pathname.includes(item.path.split("/")[2])
                      ? "bg-indigo-900 font-semibold"
                      : "hover:bg-indigo-800"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Arrows */}
      {isMobile && !mobileMenuOpen && (
        <>
          <motion.div
            className="fixed left-0 top-1/2 transform -translate-y-1/2 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={goBack}
              className="w-12 h-24 flex items-center justify-center bg-white bg-opacity-90 rounded-r-lg shadow-lg"
              aria-label="Go back"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={28} className="text-indigo-700" />
            </motion.button>
          </motion.div>
          <motion.div
            className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={goForward}
              className="w-12 h-24 flex items-center justify-center bg-white bg-opacity-90 rounded-l-lg shadow-lg"
              aria-label="Go forward"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={28} className="text-indigo-700" />
            </motion.button>
          </motion.div>
        </>
      )}
    </>
  );
};

export default AdminHeader;
