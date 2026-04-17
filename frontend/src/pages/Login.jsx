import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const endpoint = isLogin
        ? `${backendUrl}/api/user/login`
        : `${backendUrl}/api/user/register`;

      const { data } = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.token) {
        toast.success(
          `${isLogin ? "Login" : "Signup"} successful!`
        );

        login({
          token: data.token,
          user: {
            name:
              data.user?.name ||
              localStorage.getItem("signupName") ||
              formData.email.split("@")[0],

            email:
              data.user?.email ||
              formData.email,
          },
        });

        setFormData({
          ...formData,
          password: "",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="login-box">
        <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>

        <p className="subtitle">
          Welcome to Budget Expense 👋
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* FORGET PASSWORD */}
          {isLogin && (
            <div className="forgot-wrap">
              <button
                type="button"
                className="forgot-link"
                onClick={() => navigate("/reset-password")}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "LOGIN"
              : "REGISTER"}
          </button>
        </form>

        <div className="switch">
          <button
            type="button"
            className="link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;