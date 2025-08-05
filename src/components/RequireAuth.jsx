import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  return token ? children : <Navigate to="/enroll" replace />;
};

export default RequireAuth;
