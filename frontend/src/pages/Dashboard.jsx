import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useGlobalContext } from "../context/globalContext"; // Use the shared context
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";

// Import the UI Component from your other folder
import DashboardComponent from "../Components/Dashboard/Dashboard"; 
import Navigation from "../Components/Navigation/Navigation"; 

const DashboardPage = () => {
  const { token, logout } = useContext(AuthContext);
  const { getIncomes, getExpenses, error, setError } = useGlobalContext();
  const navigate = useNavigate();

  // 1. Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // 2. Fetch data via GlobalContext on mount
  useEffect(() => {
    if (token) {
      getIncomes();
      getExpenses();
    }
  }, [token, getIncomes, getExpenses]);

  // 3. Handle Global Errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null); // Clear error after showing toast
    }
  }, [error, setError]);

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <DashboardPageStyled>
      <ToastContainer />
      <Navigation handleLogout={handleLogout} /> 
      
      <main>
        {/* This renders the UI from Components/Dashboard/Dashboard.js */}
        <DashboardComponent />
      </main>
    </DashboardPageStyled>
  );
};

const DashboardPageStyled = styled.div`
  height: 100vh;
  display: flex;
  background-color: #f4f7f6;
  
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    margin: 1rem;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default DashboardPage;