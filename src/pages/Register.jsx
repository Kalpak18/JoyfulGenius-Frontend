



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { UserPlus, Eye, EyeOff } from "lucide-react";



const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    f_name: "",last_name:"", email: "", whatsappNo: "", district: "",  password: "",confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
      }
      await api.post("/users/send-otp", {
        whatsappNo: formData.whatsappNo,
      });

      localStorage.setItem("pendingUser", JSON.stringify(formData));

      setSuccess("✅ OTP sent to your mobile");
      setTimeout(() => navigate("/verify-otp"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-white px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
        <div className="text-center mb-4">
          <UserPlus size={36} className="mx-auto text-green-600 mb-2" />
          <h2 className="text-2xl font-bold text-zinc-800">Create an Account</h2>
          <p className="text-sm text-zinc-500">Register to get started with Joyful Genius</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm rounded px-4 py-2 mb-3 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 text-sm rounded px-4 py-2 mb-3 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="text"
            name="f_name"
            value={formData.f_name}
            onChange={handleChange}
            placeholder="Fisrt Name"
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
            placeholder="Email"
            required
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

          {/* <input
            type="text"
            name="taluka"
            value={formData.taluka}
            onChange={handleChange}
            placeholder="Taluka"
            required
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          /> */}

          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District"
            required
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            required
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          /> */}

          {/* <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          /> */}

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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow transition"
          >
            Send OTP
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
