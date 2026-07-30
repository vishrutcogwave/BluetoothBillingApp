import axios, { type AxiosInstance } from "axios";

// Create axios instance without baseURL
const axiosInstance: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Read latest BASE_URL before every request
axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = localStorage.getItem("BASE_URL") || "";

    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;