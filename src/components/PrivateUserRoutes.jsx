// src/components/PrivateUserRoute.jsx
// import { Navigate } from "react-router-dom";

// const PrivateUserRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token || role !== "user") {
//     return <Navigate to="/enroll" replace />;
//   }

//   return children;
// };

// export default PrivateUserRoute;
import { Navigate } from "react-router-dom";

const PrivateUserRoute = ({ children }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");

  if (!token || role !== "user") {
    return <Navigate to="/enroll" />;
  }

    return children;
};

export default PrivateUserRoute;
