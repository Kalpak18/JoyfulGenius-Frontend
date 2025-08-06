import { useState } from "react";
import api from "../utils/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setIsSending(true);

    try {
      const res = await api.post("/users/forgot-password", { email });
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-green-700">Forgot Password</h2>

        {msg && <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded">{msg}</div>}
        {error && <div className="bg-red-100 text-red-800 px-4 py-2 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
              isSending
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
