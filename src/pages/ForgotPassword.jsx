// import { useState } from "react";
// import api from "../utils/axios";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");
//   const [isSending, setIsSending] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("");
//     setError("");
//     setIsSending(true);

//     try {
//       const res = await api.post("/users/forgot-password", { email });
//       setMsg(res.data.message);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to send email");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-100 to-white flex items-center justify-center px-4">
//       <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
//         <h2 className="text-3xl font-semibold text-center mb-6 text-green-700">Forgot Password</h2>

//         {msg && <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded">{msg}</div>}
//         {error && <div className="bg-red-100 text-red-800 px-4 py-2 mb-4 rounded">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
//             <input
//               type="email"
//               className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
//               isSending
//                 ? "bg-green-400 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             }`}
//             disabled={isSending}
//           >
//             {isSending ? "Sending..." : "Send Reset Email"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import { useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [input, setInput] = useState("");
  const [step, setStep] = useState("input"); // input, otp
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const isEmail = (val) => val.includes("@") && val.includes(".");
const isMobile = (val) => /^\d{10}$/.test(val.trim());


  const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg("");
  setError("");
  setIsSending(true);

  try {
    if (isEmail(input)) {
      // ✅ Email flow (unchanged)
      const res = await api.post("/users/forgot-password", { email: input });
      setMsg(res.data.message);
      setStep("done");
    } else if (isMobile(input)) {
      // ✅ Mobile OTP flow
      const res = await api.post("/users/forgot-password-mobile", {
        whatsappNumber: input,
      });
      setMsg("OTP sent to your mobile");
      setStep("otp");
    } else {
      // ❌ Invalid input
      setError("Enter a valid email or 10-digit mobile number.");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setIsSending(false);
  }
};


  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setIsSending(true);

    try {
      const res = await api.post("/users/verify-reset-otp", {
        whatsappNumber: input,
        code: otp,
      });

      const token = res.data.resetToken;
      setMsg("OTP verified. Redirecting...");
      setTimeout(() => {
        navigate(`/reset-password/${token}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-green-700">
          Forgot Password
        </h2>

        {msg && <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded">{msg}</div>}
        {error && <div className="bg-red-100 text-red-800 px-4 py-2 mb-4 rounded">{error}</div>}

        {step === "input" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Mobile Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="Enter registered email or mobile"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
                isSending ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={isSending}
            >
              {isSending ? "Processing..." : "Continue"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                pattern="\d{6}"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${
                isSending ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={isSending}
            >
              {isSending ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
