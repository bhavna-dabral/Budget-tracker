import axios from "axios";

// ✅ Determine backend URL safely
let backendURL;

// React only exposes REACT_APP_ variables
if (process.env.REACT_APP_BACKEND_URL) {
  backendURL = process.env.REACT_APP_BACKEND_URL;
} else {
  // Fallback based on NODE_ENV
  switch (process.env.NODE_ENV) {
    case "development":
      backendURL = "http://localhost:5000";
      break;
    case "production":
      backendURL = "https://expence-tracker2.onrender.com";
      break;
    case "deployment":
      // Optional custom deployment URL
      backendURL = "https://expence-tracker2-deployment.onrender.com";
      break;
    default:
      backendURL = "http://localhost:5000";
  }
}

console.log("🔍 Using backend URL:", backendURL);
console.log("NODE_ENV:", process.env.NODE_ENV);

// ✅ Create Axios instance
const API = axios.create({
  baseURL: `${backendURL}/api/v1`,
  withCredentials: true, // send cookies if needed
});

// ✅ Attach token automatically and debug requests
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    console.log("📦 Request URL:", req.baseURL + req.url);
    console.log("🔑 Authorization token:", token ? `Bearer ${token}` : "No token found");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => {
    console.error("⚠️ Request error:", error);
    return Promise.reject(error);
  }
);

// ✅ Handle responses globally with debug logging
API.interceptors.response.use(
  (res) => {
    console.log("✅ Response received:", res.status, res.config.url);
    return res;
  },
  (error) => {
    if (error.response) {
      console.error(
        `⚠️ Response error ${error.response.status} at ${error.config.url}`,
        error.response.data
      );

      if (error.response.status === 401) {
        console.warn("🔒 Unauthorized – redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("⚠️ No response received:", error.request);
    } else {
      console.error("⚠️ Axios setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
