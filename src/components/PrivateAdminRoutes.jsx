import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth"; 

const PrivateAdminRoute = ({ children }) => {
 const { user } = useAuth();
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");
  const adminUser =
    JSON.parse(
      localStorage.getItem("admin_user") ||
      sessionStorage.getItem("admin_user") ||
      "null"
    );

  if (!adminUser || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default PrivateAdminRoute;
