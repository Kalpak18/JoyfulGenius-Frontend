// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/axios";
// import Header from "../components/Header";
// import { Eye, EyeOff, LogIn } from "lucide-react";

// const Enroll = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     identifier: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(true);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     const identifier = formData.identifier.trim();
//     const password = formData.password.trim();

//     if (!identifier || !password) {
//       setError("Email or Mobile number and password are required");
//       return;
//     }

//     try {
//       const res = await api.post("/users/login", {
//         identifier,
//         password,
//       });

//       const { token, user } = res.data;
//       const storage = rememberMe ? localStorage : sessionStorage;

//       storage.setItem("token", token);
//       storage.setItem("user", JSON.stringify(user));
//       storage.setItem("role", "user");
//       storage.setItem("isPaidUser", user.isPaid);

//       navigate("/course");
//     } catch (err) {
//       console.error("Login error:", err);
//       if (err.response?.status === 401) {
//         setError("Invalid credentials");
//       } else {
//         setError(err.response?.data?.message || "Login failed");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 to-white">
//       <Header />
//       <main className="flex-grow flex items-center justify-center px-4 pb-20 md:pb-8 pt-4">
//         <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md animate-fadeIn">
//           <div className="text-center mb-6">
//             <LogIn size={36} className="mx-auto text-green-600 mb-2" />
//             <h2 className="text-2xl font-bold text-zinc-800">Welcome Back</h2>
//             <p className="text-sm text-zinc-500">Login to your Joyful Genius account</p>
//           </div>

//           {error && (
//             <div className="bg-red-100 text-red-700 text-sm rounded px-4 py-2 mb-4">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1 text-zinc-700">
//                 Email or Mobile Number
//               </label>
//               <input
//                 type="text"
//                 name="identifier"
//                 value={formData.identifier}
//                 onChange={handleChange}
//                 placeholder="Enter email or mobile number"
//                 required
//                 className="w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1 text-zinc-700">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter your password"
//                   className="w-full border border-zinc-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-2.5 text-zinc-500 hover:text-green-600"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//               <div className="text-right">
//                 <a href="/forgot-password" className="text-sm text-green-600 hover:underline">
//                   Forgot Password?
//                 </a>
//               </div>
//             </div>

//             <div className="flex items-center text-sm">
//               <input
//                 type="checkbox"
//                 id="rememberMe"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//                 className="mr-2"
//               />
//               <label htmlFor="rememberMe" className="text-zinc-600">
//                 Remember Me
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition shadow"
//             >
//               Login
//             </button>
//           </form>

//           <p className="text-center text-sm mt-5 text-zinc-600">
//             Don't have an account?{" "}
//             <a href="/register" className="text-green-600 hover:underline font-medium">
//               Register
//             </a>
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Enroll;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import Header from "../components/Header";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

const Enroll = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isMobile = (value) => /^[0-9]{10}$/.test(value);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const identifier = formData.identifier.trim();
    const password = formData.password.trim();

    if (!identifier || !password) {
      setError("Email or Mobile number and password are required.");
      return;
    }

    // Check if the input contains both email and mobile number
    if (isEmail(identifier) && isMobile(identifier)) {
      setError("Please enter only Email or only Mobile number — not both.");
      return;
    }

    if (!isEmail(identifier) && !isMobile(identifier)) {
      setError("Please enter a valid Email or 10-digit Mobile number.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/users/login", {
        identifier,
        password,
      });

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
        setError("Invalid credentials.");
      } else {
        setError(err.response?.data?.message || "Login failed.");
      }
    } finally {
      setLoading(false);
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
            <p className="text-sm text-zinc-500">
              Login to your Joyful Genius account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-2 mb-4 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">
                Email or Mobile Number
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter email or mobile number"
                required
                className="w-full border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-700">
                Password
              </label>
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
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:underline"
                >
                  Forgot Password?
                </a>
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
              disabled={loading}
              className={`w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition shadow ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Connecting...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-zinc-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-green-600 hover:underline font-medium"
            >
              Register
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Enroll;
