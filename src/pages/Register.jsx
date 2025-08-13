// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/axios";
// import { UserPlus, Eye, EyeOff } from "lucide-react";

// const maharashtraDistricts = [
//   "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
//   "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
//   "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
//   "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar",
//   "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg",
//   "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
// ];

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     f_name: "", last_name: "", email: "", whatsappNo: "",
//     district: "", password: "", confirmPassword: ""
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       if (formData.password !== formData.confirmPassword) {
//         setError("Passwords do not match");
//         return;
//       }

//       await api.post("/users/send-otp", {
//         whatsappNo: formData.whatsappNo,
//       });

//       localStorage.setItem("pendingUser", JSON.stringify(formData));

//       setSuccess("✅ OTP sent to your mobile");
//       setTimeout(() => navigate("/verify-otp"), 1000);
//     } catch (err) {
//       if (err.response?.data?.message?.includes("already registered")) {
//         setError("This mobile number is already registered.");
//       } else {
//         setError(err.response?.data?.message || "Registration failed");
//       }
//     }

//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-white px-4">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
//         <div className="text-center mb-4">
//           <UserPlus size={36} className="mx-auto text-green-600 mb-2" />
//           <h2 className="text-2xl font-bold text-zinc-800">Create an Account</h2>
//           <p className="text-sm text-zinc-500">Register to get started with Joyful Genius</p>
//         </div>

//         {error && (
//           <div className="bg-red-100 text-red-700 text-sm rounded px-4 py-2 mb-3 text-center">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="bg-green-100 text-green-700 text-sm rounded px-4 py-2 mb-3 text-center">
//             {success}
//           </div>
//         )}

//         <form onSubmit={handleSendOtp} className="space-y-4">
//           <input
//             type="text"
//             name="f_name"
//             value={formData.f_name}
//             onChange={handleChange}
//             placeholder="First Name"
//             required
//             className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//           />
//           <input
//             type="text"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             placeholder="Last Name"
//             required
//             className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email (optional)"
//             className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//           />
//           {/* {!formData.email && (
//             <p className="text-yellow-600 text-sm">
//               You can reset your password only through mobile OTP if email is not provided.
//             </p>
//           )} */}

//           <input
//             type="text"
//             name="whatsappNo"
//             value={formData.whatsappNo}
//             onChange={handleChange}
//             placeholder="WhatsApp Number"
//             required
//             className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//           />

//           {/* ✅ District Dropdown */}
//           <select
//             name="district"
//             value={formData.district}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
//           >
//             <option value="">-- Select District --</option>
//             {maharashtraDistricts.map((district) => (
//               <option key={district} value={district}>{district}</option>
//             ))}
//           </select>

//           {/* ✅ Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               required
//               className="w-full p-2 pr-10 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//             <div
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute right-3 top-2.5 text-zinc-500 cursor-pointer"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </div>
//           </div>

//           {/* ✅ Confirm Password */}
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm Password"
//               required
//               className="w-full p-2 pr-10 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//             <div
//               onClick={() => setShowConfirmPassword((prev) => !prev)}
//               className="absolute right-3 top-2.5 text-zinc-500 cursor-pointer"
//             >
//               {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow transition"
//           >
//             Send OTP
//           </button>
//         </form>

//         <p className="text-center text-sm mt-4 text-zinc-600">
//           Already have an account?{" "}
//           <a href="/enroll" className="text-green-600 hover:underline font-medium">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";

const maharashtraDistricts = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
  "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
  "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
  "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar",
  "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg",
  "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    f_name: "",
    last_name: "",
    email: "",
    whatsappNo: "",
    district: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
     let { name, value } = e.target;

  if (name === "whatsappNo") {
    // Remove all non-digit characters
    let digitsOnly = value.replace(/\D/g, "");

    // If starts with '91' and is longer than 10 digits, take last 10 digits
    if (digitsOnly.startsWith("91") && digitsOnly.length > 10) {
      digitsOnly = digitsOnly.slice(-10);
    }

    // Limit input to max 13 digits (country code + number) just for UI control
    if (digitsOnly.length > 13) return;

    setFormData({ ...formData, [name]: digitsOnly });
    return;
  }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Passwords do not match. Please re-enter.");
      return;
    }

     // WhatsApp validation (exactly 10 digits after cleanup)
  const cleanNumber = formData.whatsappNo.replace(/\D/g, "");
  const finalNumber = cleanNumber.startsWith("91") && cleanNumber.length > 10
    ? cleanNumber.slice(-10)
    : cleanNumber;

  if (finalNumber.length !== 10) {
    setError("❌ WhatsApp number must be exactly 10 digits.");
    return;
  }

    try {
      setLoading(true);
      const res = await api.post("/users/register", {
      ...formData,
      whatsappNo: finalNumber // send clean 10-digit number to backend
    });
      const registeredUser = res.data.user;

      localStorage.setItem("userInfo", JSON.stringify(registeredUser));

      setSuccess("🎉 Account created successfully! Redirecting...");
      setTimeout(() => navigate("/course-selection"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "⚠️ Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-white px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
        <div className="text-center mb-4">
          <UserPlus size={36} className="mx-auto text-green-600 mb-2" />
          <h2 className="text-2xl font-bold text-zinc-800">Create an Account</h2>
          <p className="text-sm text-zinc-500">
            Register to get started with Joyful Genius
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded px-4 py-2 mb-3 text-center animate-shake">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 text-sm rounded px-4 py-2 mb-3 text-center animate-fadeIn">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="f_name"
            value={formData.f_name}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email (optional)"
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="whatsappNo"
            value={formData.whatsappNo}
            onChange={handleChange}
            placeholder="WhatsApp Number"
            required
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          >
            <option value="">-- Select District --</option>
            {maharashtraDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-2 pr-10 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-zinc-500 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full p-2 pr-10 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <div
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-zinc-500 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-zinc-600">
          Already have an account?{" "}
          <a href="/enroll" className="text-green-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
