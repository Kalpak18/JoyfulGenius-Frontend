import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  //baseURL: "/api",
  withCredentials: false, // No need for cookies-based auth here
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token") || localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

