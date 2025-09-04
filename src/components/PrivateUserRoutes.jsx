import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../utils/axios";


const PrivateUserRoute = ({ children }) => {
  const token = getToken();
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");

  if (!token || role !== "user") {
    return <Navigate to="/enroll" />;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    // Don't block expired tokens — backend will decide
    if (decoded.exp && decoded.exp < now) {
      console.warn("Token expired, backend will verify grace period.");
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/enroll" />;
  }
};

export default PrivateUserRoute;



// // export default PrivateUserRoute;
// import { Navigate } from "react-router-dom";

// const PrivateUserRoute = ({ children }) => {
//   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//   const role = localStorage.getItem("role") || sessionStorage.getItem("role");

//   if (!token || role !== "user") {
//     return <Navigate to="/enroll" />;
//   }

//     return children;
// };

// export default PrivateUserRoute;
