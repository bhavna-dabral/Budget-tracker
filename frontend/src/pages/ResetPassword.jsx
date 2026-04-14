import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // STEP 1 — Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-reset-otp`, { email });
      if (data.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // STEP 2 — Verify OTP + reset password
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success("Password reset successful!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div style={styles.card}>
        <h2 style={styles.title}>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
        <p style={styles.subtitle}>
          {step === 1
            ? "Enter your registered email to receive an OTP."
            : "Enter the OTP sent to your email and set a new password."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" style={styles.buttonPrimary}>
              Send OTP
            </button>
            <p style={styles.link} onClick={() => navigate("/login")}>
              Back to Login
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={styles.form}>
            <input
              type="text"
              placeholder="Enter OTP"
              style={styles.input}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              style={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" style={styles.buttonSuccess}>
              Reset Password
            </button>
            <p style={styles.link} onClick={() => setStep(1)}>
              Resend OTP
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

// ✅ CSS Styles (matches your project palette)
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #11121c 0%, #181a27 100%)",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "rgba(30, 30, 45, 0.85)",
    backdropFilter: "blur(12px)",
    padding: "35px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 0 25px rgba(108, 99, 255, 0.2)",
    textAlign: "center",
    animation: "fadeIn 0.6s ease-in-out",
    color: "#fff",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#ccc",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backgroundColor: "#181a27",
    color: "#e4e4f0",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.25s",
  },
  buttonPrimary: {
    backgroundColor: "#6C63FF",
    color: "#fff",
    border: "none",
    padding: "10px 0",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.25s",
  },
  buttonSuccess: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "10px 0",
    borderRadius: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.25s",
  },
  link: {
    color: "#6C63FF",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "10px",
    transition: "color 0.25s",
  },
};
export default ResetPassword;
