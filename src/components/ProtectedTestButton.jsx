import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import useAuth from "../hooks/useAuth";

const NMMS_COURSE_ID = "68a22e67ba843698d32c427a"; // replace with actual from DB

const ProtectedTestButton = ({ testLink, courseId, courseName, small = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkPaid = async () => {
    try {
      const res = await api.get("/users/me");
      const freshUser = res.data;

      console.log("👉 courseId prop:", courseId);
      console.log("👉 user.courses:", freshUser.courses);

      const isPaidForThisCourse = (freshUser.courses || []).some(
        (c) =>
          c.courseId?.toString() === courseId?.toString() &&
          c.isPaid === true
      );

      setIsPaid(isPaidForThisCourse);
    } catch (err) {
      console.error("Error verifying course access:", err);
      setIsPaid(false);
    } finally {
      setLoading(false);
    }
  };

  checkPaid();
}, [courseId]);


  const handleClick = () => {
    if (isPaid) {
      window.open(testLink, "_blank");
    } else {
      if (courseId?.toString() === NMMS_COURSE_ID.toString()) {
        navigate("/NMMS/course-selection");
      } else {
        navigate(`/course/${courseName}/payment`);
      }
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white font-semibold py-1.5 px-3 rounded-full shadow cursor-not-allowed"
      >
        Checking...
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
      } text-white font-semibold ${
        small ? "py-1 px-2 text-sm" : "py-2 px-4"
      } rounded-full shadow transition`}
    >
      🧠 Master Test
    </button>
  );
};

export default ProtectedTestButton;
