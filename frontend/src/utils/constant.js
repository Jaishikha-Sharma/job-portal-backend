const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:8000" : "https://job-portal-backend-2tyj.onrender.com");

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;

console.log("BASE_URL is:", BASE_URL);
