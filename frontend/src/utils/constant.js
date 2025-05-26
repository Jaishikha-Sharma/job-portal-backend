const isProduction = window.location.hostname !== "localhost";
const BASE_URL = isProduction
  ? "https://job-portal-backend-2tyj.onrender.com"
  : "http://localhost:8000";

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
export const ADMIN_API_END_POINT = `${BASE_URL}/admin`;
