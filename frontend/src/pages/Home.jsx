import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Home() {
  const navigate = useNavigate();

  return (
    <HomeStyled>
      <div className="overlay">
        <div className="card">
          <h1>💰 Budget Expense Tracker</h1>

          <p>
            Manage your income, expenses, smart analytics, reports and financial
            insights — all in one place.
          </p>

          <div className="buttons">
            <button
              className="primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="secondary"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="features">
            <span>📊 Analytics</span>
            <span>🧠 Smart Insights</span>
            <span>📄 PDF Reports</span>
            <span>🔐 Secure Login</span>
          </div>
        </div>
      </div>
    </HomeStyled>
  );
}

const HomeStyled = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #050816, #0b1028, #12163b);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .overlay {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card {
    width: 100%;
    max-width: 650px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    padding: 50px 35px;
    text-align: center;
    box-shadow: 0 0 40px rgba(108,99,255,0.18);
  }

  h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 18px;
  }

  p {
    color: #c7c9e2;
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 35px;
  }

  .buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 30px;
  }

  button {
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 700;
    transition: 0.3s ease;
  }

  .primary {
    background: #6c63ff;
    color: white;
  }

  .primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(108,99,255,0.35);
  }

  .secondary {
    background: transparent;
    border: 1px solid #6c63ff;
    color: white;
  }

  .secondary:hover {
    background: #6c63ff;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    color: #d6d8f5;
    font-size: 0.95rem;
    margin-top: 10px;
  }

  @media (max-width: 768px) {
    .card {
      padding: 35px 22px;
    }

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }

    .features {
      grid-template-columns: 1fr;
    }
  }
`;

export default Home;