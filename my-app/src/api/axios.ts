
import axios, { type AxiosInstance } from "axios";

// 🔹 Get BASE_URL from localStorage
const getBaseURL = () => {
  const url = localStorage.getItem("BASE_URL");
  return url ? url : "";
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
