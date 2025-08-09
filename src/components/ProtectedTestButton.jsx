// import { useNavigate } from "react-router-dom";

// const ProtectedTestButton = ({ testLink }) => {
//   const navigate = useNavigate();

//   const isPaid = 
//     localStorage.getItem("isPaidUser") === "true"||
//     sessionStorage.getItem("isPaidUser") === "true";

//   const handleClick = () => {
//     if (isPaid) {
//       window.open(testLink, "_blank");
//     } else {
//       navigate("/course-selection");
//     }
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-full text-center shadow hover:from-pink-600 hover:to-purple-600 transition duration-300 ease-in-out"
//     >
//       🧠 Master Test
//     </button>
//   );
// };

// export default ProtectedTestButton;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const ProtectedTestButton = ({ testLink }) => {
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const res = await api.get("/users/me");
        setIsPaid(res.data.isPaid);

        // Store in localStorage for quick checks
        localStorage.setItem("isPaidUser", res.data.isPaid ? "true" : "false");
      } catch (err) {
        console.error("Error fetching payment status", err);
        localStorage.removeItem("isPaidUser");
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  const handleClick = () => {
    if (isPaid) {
      window.open(testLink, "_blank");
    } else {
      navigate("/course-selection");
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-full text-center shadow cursor-not-allowed"
      >
        Checking status...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${
        isPaid
          ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600"
          : "bg-gray-500 hover:bg-gray-600"
      } text-white font-semibold py-2 px-4 rounded-full text-center shadow transition duration-300 ease-in-out`}
    >
      🧠 Master Test {isPaid ? "" : "(Locked)"}
    </button>
  );
};

export default ProtectedTestButton;
