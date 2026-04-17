import React, { useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/user/register`,
        formData
      );

      // if backend gives token after signup
      if (data.token) {
        toast.success("Signup successful!");

        login({
          token: data.token,
          user: data.user || {
            name: formData.name,
            email: formData.email,
          },
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        toast.success("Signup successful! Please login.");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <ToastContainer position="top-right" autoClose={2000} />

      <form
        onSubmit={handleSignup}
        className="signup-box"
      >
        <h2>Create Account</h2>
        <p className="subtitle">
          Join Budget Expense 🚀
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
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

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Sign Up"}
        </button>

        <p className="bottom-text">
          Already have account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;