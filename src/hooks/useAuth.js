// import { useEffect, useState } from "react";

// const getStoredData = () => {
//   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//   const adminToken = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
//   const role = localStorage.getItem("role") || sessionStorage.getItem("role");
//   const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
//   let user = null;

//   try {
//     if (storedUser) user = JSON.parse(storedUser);
//   } catch (err) {
//     console.error("🔴 Error parsing stored user:", err);
//   }

//   return { token, adminToken, role, user };
// };

// const useAuth = () => {
//   const [auth, setAuth] = useState({
//     token: null,
//     adminToken: null,
//     role: null,
//     user: null,
//     loading: true,
//   });

//   useEffect(() => {
//     const data = getStoredData();
//     setAuth({ ...data, loading: false });
//   }, []);

//   const login = ({ token, user, role = "user", adminToken = null, remember = true }) => {
//     const storage = remember ? localStorage : sessionStorage;

//     if (token) storage.setItem("token", token);
//     if (adminToken) storage.setItem("adminToken", adminToken);
//     if (user) storage.setItem("user", JSON.stringify(user));
//     storage.setItem("role", role);

//     setAuth({ token, adminToken, user, role, loading: false });
//   };

//   const logout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     setAuth({ token: null, adminToken: null, user: null, role: null, loading: false });
//   };

//   const isAuthenticated = !!auth.token || !!auth.adminToken;
//   const isAdmin = auth.role === "admin";
//   const isUser = auth.role === "user";

//   return {
//     ...auth,
//     login,
//     logout,
//     isAuthenticated,
//     isAdmin,
//     isUser,
//   };
// };

// export default useAuth;


// useAuth.js
import { useState, useEffect } from "react";

const useAuth = () => {
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role") || sessionStorage.getItem("role");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const adminToken = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

    if (role === "admin" && !adminToken) {
      setIsAdmin(false);
    } else {
      setIsAdmin(role === "admin");
    }

    setIsUser(role === "user");

    if (storedUser && role === "user") {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "");
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsUser(false);
    setIsAdmin(false);
    setUserName("");
  };

  return {
    isUser,
    isAdmin,
    userName,
    loading,
    logout,
  };
};

export default useAuth;

