
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home, BookOpen, User, LogIn, LogOut, Menu, X,
  ChevronLeft, ChevronRight
} from "lucide-react";
import useAuth from "../hooks/useAuth.js";

const Header = ({ hideHeader = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavButtons, setShowNavButtons] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { isUser, isAdmin, userName, logout, loading } = useAuth();

  useEffect(() => {
    const noNavPages = ["/", "/courses", "/admin/login"];
    setShowNavButtons(!noNavPages.includes(location.pathname));
  }, [location]);

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate(isUser ? "/courses" : "/");
  };

  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);

  if (hideHeader) return null;

  const MobileSideNavigation = () => (
    <>
      <div className="md:hidden fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
        <button onClick={goBack} className="w-8 h-20 flex items-center justify-center bg-transparent" aria-label="Go back">
          <ChevronLeft size={24} className="text-blue-950" />
        </button>
      </div>
      <div className="md:hidden fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
        <button onClick={goForward} className="w-8 h-20 flex items-center justify-center bg-transparent" aria-label="Go forward">
          <ChevronRight size={24} className="text-blue-950" />
        </button>
      </div>
    </>
  );

  const MobileNavigation = () => {
    const isActive = (path) => location.pathname.startsWith(path);
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 z-50">
        <div className="flex justify-around py-2">
          <button onClick={handleHomeClick} className={`flex flex-col items-center p-2 ${isActive('/') || isActive('/course') ? 'text-amber-400' : 'text-white'}`}>
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <Link to="/study-materials" className={`flex flex-col items-center p-2 ${isActive('/study-materials') ? 'text-amber-400' : 'text-white'}`} onClick={() => setIsOpen(false)}>
            <BookOpen size={20} />
            <span className="text-xs mt-1">Materials</span>
          </Link>
          <Link to="/syllabus" className={`flex flex-col items-center p-2 ${isActive('/syllabus') ? 'text-amber-400' : 'text-white'}`} onClick={() => setIsOpen(false)}>
            <BookOpen size={20} />
            <span className="text-xs mt-1">Syllabus</span>
          </Link>

          {!loading && (
  <>
    {isUser && (
      <Link
        to="/dashboard"
        className={`flex flex-col items-center p-2 ${isActive('/dashboard') ? 'text-amber-400' : 'text-white'}`}
        onClick={() => setIsOpen(false)}
      >
        <User size={20} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    )}
    {isAdmin && (
      <button
        onClick={() => { logout(); setIsOpen(false); }}
        className="flex flex-col items-center p-2 text-white"
      >
        <LogOut size={20} />
        <span className="text-xs mt-1">Logout</span>
      </button>
    )}
    {!isUser && !isAdmin && (
      <Link
        to="/admin/login"
        className={`flex flex-col items-center p-2 ${isActive('/admin/login') ? 'text-amber-400' : 'text-white'}`}
        onClick={() => setIsOpen(false)}
      >
        <LogIn size={20} />
        <span className="text-xs mt-1">Login</span>
      </Link>
    )}
  </>
)}

        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block bg-gradient-to-r from-zinc-800 to-zinc-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {showNavButtons && (
              <div className="flex space-x-2">
                <button onClick={goBack} className="w-10 h-10 flex items-center justify-center bg-zinc-700 rounded-full shadow-md hover:bg-amber-500 transition-colors" aria-label="Go back">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={goForward} className="w-10 h-10 flex items-center justify-center bg-zinc-700 rounded-full shadow-md hover:bg-amber-500 transition-colors" aria-label="Go forward">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            <div onClick={handleHomeClick} className="text-2xl font-bold cursor-pointer flex items-center px-4 py-1 rounded-lg hover:bg-zinc-600 transition-colors">
              <span className="text-amber-400">JOYFUL</span> <span className="text-white">GENIUS</span>
            </div>
          </div>

          {isUser && userName && (
            <span className="text-sm text-amber-300 mr-4">Welcome, {userName.split(" ")[0]}</span>
          )}

          <nav className="flex space-x-6 items-center">
            <Link to="/syllabus" className="hover:text-amber-300 transition-colors">Syllabus</Link>
            <Link to="/study-materials" className="hover:text-amber-300 transition-colors">Study Materials</Link>
           {!loading && (
            isAdmin ? (
              <button onClick={logout} className="hover:text-red-400 transition-colors">Logout</button>
            ) : isUser ? (
              <Link to="/dashboard" className="hover:text-amber-300 transition-colors">Dashboard</Link>
            ) : (
              <Link to="/admin/login" className="hover:text-amber-300 transition-colors">Admin Login</Link>
            )
          )}

          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-zinc-800 text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div onClick={handleHomeClick} className="text-xl font-bold flex items-center">
            <span className="text-amber-400">JG</span>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`bg-zinc-700 transition-all duration-300 ${isOpen ? "max-h-screen py-4" : "max-h-0 overflow-hidden"}`}>
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {isUser && userName && (
              <div className="py-2 px-4 text-amber-300">
                Welcome, {userName.split(" ")[0]}
              </div>
            )}
            <Link to="/" onClick={(e) => { handleHomeClick(e); setIsOpen(false); }} className="flex items-center py-2 px-4 hover:bg-zinc-600 rounded-lg">
              <Home size={18} className="mr-3" /> Home
            </Link>
            <Link to="/syllabus" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-zinc-600 rounded-lg">Syllabus</Link>
            <Link to="/study-materials" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-zinc-600 rounded-lg">Study Materials</Link>
            {!loading && (
              isAdmin ? (
                <button onClick={() => { logout(); setIsOpen(false); }} className="text-left py-2 px-4 hover:bg-zinc-600 rounded-lg text-red-400">
                  Logout
                </button>
              ) : isUser ? (
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-zinc-600 rounded-lg">Dashboard</Link>
              ) : (
                <Link to="/admin/login" onClick={() => setIsOpen(false)} className="py-2 px-4 hover:bg-zinc-600 rounded-lg">Admin Login</Link>
              )
            )}
          </div>
        </div>
      </header>

      {showNavButtons && <MobileSideNavigation />}
      <MobileNavigation />
    </>
  );
};

export default Header;
