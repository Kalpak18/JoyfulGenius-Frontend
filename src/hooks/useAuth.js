

import { useState, useEffect, useCallback } from "react";
import api, { getToken, setToken, clearStorageAndLogout } from "../utils/axios";

const useAuth = () => {
  const [user, setUser] = useState(() => {
  try {
    const role =
      localStorage.getItem("role") || sessionStorage.getItem("role") || null;

    if (role === "admin") {
      const storedAdmin =
        localStorage.getItem("admin_user") ||
        sessionStorage.getItem("admin_user");
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    } else {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
  } catch {
    return null;
  }
});


  const [loading, setLoading] = useState(true);

  // 🔑 Read role safely
  const getRole = useCallback(() => {
    return (
      localStorage.getItem("role") ||
      sessionStorage.getItem("role") ||
      null
    );
  }, []);

  const isAdmin = user && getRole() === "admin";
  const isUser = user && getRole() === "user";
  const userName = user?.name || user?.email || "";


  // 🔒 Logout helper
  const logout = useCallback(() => {
    clearStorageAndLogout();
    setUser(null);
  }, []);

  // ✅ On mount: always try to refresh using cookie
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const role = getRole() || "user"; // default to user
        const endpoint = role === "admin" ? "/admin/refresh" : "/users/auth/refresh";

        const res = await api.post(endpoint, {}, { withCredentials: true });

          const { accessToken, user: refreshedUser, role: roleFromAPI } = res.data;
        if (accessToken && refreshedUser) {
          const rememberMe = localStorage.getItem("rememberMe") === "true";
          const roleToPersist = roleFromAPI || role;
          setToken(accessToken, rememberMe, refreshedUser, roleToPersist);
          setUser(prevUser =>
            JSON.stringify(prevUser) !== JSON.stringify(refreshedUser)
              ? refreshedUser
              : prevUser
          );
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    // ⚡ Only refresh if we already have a token OR cookie exists
    if (getToken()) {
      initializeAuth();
    } else {
      setLoading(false);
    }
  }, [getRole, logout]);

  return {
    user,
    isAdmin,
    isUser,
    userName,
    loading,
    logout,
    setUser,
  };
};

export default useAuth;
