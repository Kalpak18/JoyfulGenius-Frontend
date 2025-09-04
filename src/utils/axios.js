// utils/axios.js



import axios from "axios";

// --- Create axios instance ---
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
  withCredentials: true, // so refresh cookie works
});

// --- Token Helpers ---

// Get token (reads from localStorage first, then sessionStorage)
// export const getToken = () => {
//   return (
//     localStorage.getItem("token") ||
//     sessionStorage.getItem("token") ||
//     null
//   );
// };


 // role-aware getter
 export const getToken = () => {
   const role =
    localStorage.getItem("role") ||
    sessionStorage.getItem("role") ||
    "user";
  if (role === "admin") {
    return (
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token") ||
      null
    );
  }
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null
  );
   };


export const setToken = (
   token,
   rememberMe = true,
   account = null,
   role = "user"
 ) => {
   const store = rememberMe ? localStorage : sessionStorage;
   const remember = rememberMe ? "true" : "false";

   if (role === "admin") {
       localStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_token");
    store.setItem("admin_token", token);
    store.setItem("role", "admin");
    localStorage.setItem("rememberMe", remember);
    if (account) store.setItem("admin_user", JSON.stringify(account));
    return;
   }

   localStorage.removeItem("token");
   localStorage.removeItem("user");
   sessionStorage.removeItem("token");
   sessionStorage.removeItem("user");
   store.setItem("token", token);
   store.setItem("role", "user");
   localStorage.setItem("rememberMe", remember);
   if (account) store.setItem("user", JSON.stringify(account));
 };


// Clear everything
// export const clearStorageAndLogout = (navigate) => {
//   localStorage.clear();
//   sessionStorage.clear();
//   if (navigate) {
//     navigate("/enroll", { replace: true });
//   } else {
//     window.location.href = "/enroll"; // fallback
//   }
// };

 export const clearStorageAndLogout = (navigate) => {
   const role =
     localStorage.getItem("role") || sessionStorage.getItem("role");
   localStorage.clear();
   sessionStorage.clear();
   const dest = role === "admin" ? "/admin/login" : "/enroll";
   if (navigate) navigate(dest, { replace: true });
   else window.location.href = dest;
 };

// --- Unified Logout ---
export const handleLogout = async (navigate) => {
  try {
    const role =
      localStorage.getItem("role") || sessionStorage.getItem("role");

    const endpoint = role === "admin" ? "/admin/logout" : "/users/logout";

    await api.post(endpoint, {}); // server clears refresh cookie

    // tiny delay so cookie clears properly
    await new Promise((r) => setTimeout(r, 200));
  } catch (err) {
    console.error("❌ Logout API failed", err);
  } finally {
    localStorage.clear();
    sessionStorage.clear();

    // smooth navigation (not hard reload)
    navigate("/enroll", { replace: true });
  }
};


// --- Attach token to requests ---
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Refresh Token Logic ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

     try {
          // --- role-aware refresh endpoint + role preservation ---
          const currentRole =
            localStorage.getItem("role") ||
            sessionStorage.getItem("role") ||
            "user";

          const refreshUrl =
            currentRole === "admin"
              ? `${import.meta.env.VITE_API_URL}/admin/refresh`
              : `${import.meta.env.VITE_API_URL}/users/auth/refresh`;

          const res = await axios.post(refreshUrl, {}, { withCredentials: true });
          const { accessToken, user, role: roleFromAPI } = res.data || {};
          const rememberMe = localStorage.getItem("rememberMe") === "true";
          const roleToPersist = roleFromAPI || currentRole;

          setToken(accessToken, rememberMe, user, roleToPersist);
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return api(originalRequest);
        } catch (refreshError) {
     
        processQueue(refreshError, null);
        clearStorageAndLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
