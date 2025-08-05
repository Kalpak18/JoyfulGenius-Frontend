import { useNavigate } from "react-router-dom";

const ProtectedTestButton = ({ testLink }) => {
  const navigate = useNavigate();

  const isPaid = 
    localStorage.getItem("isPaidUser") === "true"||
    sessionStorage.getItem("isPaidUser") === "true";

  const handleClick = () => {
    if (isPaid) {
      window.open(testLink, "_blank");
    } else {
      navigate("/course-selection");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-full text-center shadow hover:from-pink-600 hover:to-purple-600 transition duration-300 ease-in-out"
    >
      🧠 Master Test
    </button>
  );
};

export default ProtectedTestButton;
