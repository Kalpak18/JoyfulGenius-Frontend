// // src/pages/Enroll.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/axios";
// import Header from "../components/Header";

// const Enroll = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//  const handleLogin = async (e) => {
//   e.preventDefault();
//   setError("");

//   const email = formData.email.trim();
//   const password = formData.password.trim();

//   if (!email || !password) {
//     setError("Email and password are required");
//     return;
//   }

//   try {
//     const res = await api.post("/users/login", { email, password });

//     const { token, user } = res.data; // ✅ DESTRUCTURE user properly here

//     const storage = rememberMe ? localStorage : sessionStorage;

//     storage.setItem("token", token);
//     storage.setItem("user", JSON.stringify(user));
//     storage.setItem("role", "user");
//     storage.setItem("isPaidUser", user.isPaid); // ✅ Now user is defined

//     navigate("/course");
//   } catch (err) {
//     console.error("Login error:", err);
//     if (err.response?.status === 401) {
//       setError("Invalid email or password");
//     } else {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   }
// };


//   return (
//     <div>
//       <Header />
//       <main className="container mx-auto p-4">
//         <div className="flex justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//             <h2 className="text-2xl font-bold mb-4 text-center">User Login</h2>
//             {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//             <form onSubmit={handleLogin}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full p-2 border rounded"
//                   placeholder="Enter your email"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Password</label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     className="w-full p-2 border rounded"
//                     placeholder="Enter your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-2 top-2 text-sm text-blue-500"
//                   >
//                     {showPassword ? "Hide" : "Show"}
//                   </button>
//                 </div>
//               </div>
//               <div className="mb-6 flex items-center">
//                 <input
//                   type="checkbox"
//                   id="rememberMe"
//                   checked={rememberMe}
//                   onChange={() => setRememberMe(!rememberMe)}
//                   className="mr-2"
//                 />
//                 <label htmlFor="rememberMe" className="text-sm">Remember Me</label>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
//               >
//                 Login
//               </button>
//             </form>
//             <p className="text-center mt-4">
//               Don't have an account?{" "}
//               <a href="/register" className="text-blue-600 hover:underline">
//                 Register
//               </a>
//             </p>
//           </div>
//         </div>
//       </main>
//       {/* <footer className="bg-gray-800 text-white text-center p-4 mt-8">
//         <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
//       </footer> */}
//     </div>
//   );
// };

// export default Enroll;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import Header from "../components/Header";
import { Eye, EyeOff, LogIn } from "lucide-react";

const Enroll = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await api.post("/users/login", { email, password });
      const { token, user } = res.data;

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(user));
      storage.setItem("role", "user");
      storage.setItem("isPaidUser", user.isPaid);

      navigate("/course");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 to-white">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 pb-20 md:pb-8 pt-4">
        <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md animate-fadeIn">
          <div className="text-center mb-6">
            <LogIn size={36} className="mx-auto text-green-600 mb-2" />
            <h2 className="text-2xl font-bold text-zinc-800">Welcome Back</h2>
            <p className="text-sm text-zinc-500">Login to your Joyful Genius account</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm rounded px-4 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full border border-zinc-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-green-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-zinc-600">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition shadow"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-zinc-600">
            Don't have an account?{" "}
            <a href="/register" className="text-green-600 hover:underline font-medium">
              Register
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Enroll;

