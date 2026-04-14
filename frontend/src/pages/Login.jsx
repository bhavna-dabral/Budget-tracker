import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? `${backendUrl}/api/user/login`
        : `${backendUrl}/api/user/register`;

      const { data } = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        toast.success(`${isLogin ? "Login" : "Signup"} successful!`);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="login-box">
        <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
        <p className="subtitle">Welcome to Budget Expense 👋</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              placeholder="Full Name"
              required
            />
          )}

          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Email"
            required
          />

          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password"
            required
          />

          {isLogin && (
            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <button
                type="button"
                className="link"
                onClick={() => navigate("/reset-password")}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="btn-primary">
            {isLogin ? "LOGIN" : "REGISTER"}
          </button>
        </form>

        <div className="switch">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button className="link" onClick={() => setIsLogin(false)}>
                Create Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="link" onClick={() => setIsLogin(true)}>
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
