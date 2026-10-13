// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (data?.errors) {
    const errors = Array.isArray(data.errors) ? data.errors : Object.values(data.errors).flat();
    return errors.join(" ");
  }
  return "Đã xảy ra lỗi, vui lòng thử lại.";
}

export default axiosClient;