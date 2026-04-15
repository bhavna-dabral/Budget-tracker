import axios from "axios";

// ✅ Automatic URL detection
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const backendURL = isLocal 
  ? "http://localhost:5000" 
  : "https://budget-tracker-1430.onrender.com"; // Matches your Render screenshot

const API = axios.create({
  baseURL: `${backendURL}/api`, // Ensure this matches your backend route prefix
  withCredentials: true,
});

// ✅ Request Interceptor for Auth
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;