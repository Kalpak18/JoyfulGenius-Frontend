

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { ShieldCheck } from "lucide-react";


const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("pendingUser"));
  const whatsappNo = userData?.whatsappNo || "";

  useEffect(() => {
    if (!userData) navigate("/register");
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/users/verify-otp", {
        whatsappNumber,
        code: otp,
        // user: userData,
      });

      localStorage.removeItem("pendingUser");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", "user");

      navigate("/course-selection");
    } catch (err) {
      console.error("OTP verify failed:", err);
      setError(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-white px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 animate-fadeIn">
        <div className="text-center mb-4">
          <ShieldCheck size={40} className="text-green-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-zinc-800">Verify OTP</h2>
          <p className="text-sm text-zinc-500">
            Enter the 6-digit code sent to <span className="font-medium">{whatsappNumber}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm text-center px-3 py-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            pattern="\d{6}"
            required
            className="w-full p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter 6-digit OTP"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Didn’t receive the OTP?{" "}
          <a href="/register" className="text-green-600 font-medium hover:underline">
            Try Again
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
