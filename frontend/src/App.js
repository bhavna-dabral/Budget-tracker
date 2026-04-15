import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

// Layout
import DashboardLayout from "./Layouts/DashboardLayout";

/* ---------------- PRIVATE ROUTE ---------------- */

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  // 🔐 if no token → force login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ---------------- APP ---------------- */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ---------------- PUBLIC ROUTES ---------------- */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ---------------- PROTECTED ROUTES ---------------- */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          />

          {/* ---------------- FALLBACK ---------------- */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;