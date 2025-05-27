import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://job-portal-backend-2tyj.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
