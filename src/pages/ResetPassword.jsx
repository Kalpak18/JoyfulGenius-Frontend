import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../utils/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setIsSubmitting(true);
    setShowLoginButton(false);

    try {
      const res = await api.post(`/users/reset-password/${token}`, { password });
      setMsg(res.data.message);
      setShowLoginButton(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-green-700">Reset Password</h2>

        {msg && (
          <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded text-center">
            {msg}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 mb-4 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              />
              <div
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
              isSubmitting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {showLoginButton && (
          <div className="mt-4 text-center">
            <Link
              to="/enroll"
              className="inline-block bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition"
            >
             Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
