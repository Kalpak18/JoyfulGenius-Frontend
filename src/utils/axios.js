// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   //baseURL: "/api",
//   withCredentials: false, // No need for cookies-based auth here
// });

// api.interceptors.request.use((config) => {
//   const token =
//     localStorage.getItem("token") || sessionStorage.getItem("token") || localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // No cookies-based auth
});

// ✅ Attach token to every request
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle expired or invalid tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Remove all stored tokens
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");

      // Optional: show alert/toast
      alert("Your session has expired. Please log in again.");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;


