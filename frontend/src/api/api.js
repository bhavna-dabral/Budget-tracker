import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const backendURL = isLocal 
  ? "http://localhost:5000" 
  : "https://budget-tracker-1430.onrender.com";

const API = axios.create({
  // Remove the trailing /api here to give you more flexibility 
  // with /api/user and /api/v1 routes
  baseURL: backendURL, 
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;