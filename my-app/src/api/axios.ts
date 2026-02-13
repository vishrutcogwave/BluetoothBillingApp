// import axios, { type AxiosInstance } from "axios";

// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default axiosInstance;
import axios, { type AxiosInstance } from "axios";

// 🔹 Get BASE_URL from localStorage
const getBaseURL = () => {
  const url = localStorage.getItem("BASE_URL");
  return url ? url : "";
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
