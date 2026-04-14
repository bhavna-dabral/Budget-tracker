import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";

function IncomeFormWithHistory() {
  const { addIncome, error, setError } = useGlobalContext();

  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    date: null,
    category: "",
    description: "",
  });

  const { title, amount, date, category, description } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date || !category) {
      setError("Please fill all required fields.");
      return;
    }
    addIncome(inputState);
    setInputState({ title: "", amount: "", date: null, category: "", description: "" });
  };

  return (
    <FormContainer>
      <div className="form-card">
        <h2>Add Income</h2>
        {error && <p className="error-box">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Income Title</label>
            <input
              type="text"
              value={title}
              placeholder="e.g. Freelance Project"
              onChange={handleInput("title")}
            />
          </div>

          <div className="input-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              placeholder="Enter amount"
              onChange={handleInput("amount")}
            />
          </div>

          <div className="input-group">
            <label>Date</label>
            <DatePicker
              selected={date}
              dateFormat="dd-MM-yyyy"
              placeholderText="Choose date"
              onChange={(date) => setInputState({ ...inputState, date })}
              className="date-picker"
            />
          </div>

          <div className="input-group">
            <label>Category</label>
            <select value={category} onChange={handleInput("category")}>
              <option value="" disabled>Select Category</option>
              <option value="salary">Salary</option>
              <option value="freelancing">Freelancing</option>
              <option value="investments">Investments</option>
              <option value="stocks">Stocks</option>
              <option value="bitcoin">Bitcoin</option>
              <option value="bank">Bank Transfer</option>
              <option value="youtube">YouTube</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              value={description}
              placeholder="Add a note..."
              rows="3"
              onChange={handleInput("description")}
            />
          </div>

          <Button
            name="Add Income"
            icon={plus}
            bPad=".9rem 0"
            bRad="12px"
            bg="#6C63FF"
            color="#fff"
            type="submit"
          />
        </form>
      </div>
    </FormContainer>
  );
}

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;

  .form-card {
    width: 100%;
    max-width: 520px;
    padding: 2rem;
    background: #11121c;
    border-radius: 18px;
    box-shadow: 0 0 25px rgba(108, 99, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    animation: fadeIn 0.4s ease-in-out;

    h2 {
      text-align: center;
      color: #ffffff;
      margin-bottom: 1.5rem;
      font-size: 1.7rem;
      font-weight: 700;
      letter-spacing: 1px;
    }
  }

  .error-box {
    background: rgba(255, 82, 82, 0.15);
    border-left: 4px solid #ff5252;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    color: #ff5252;
    font-weight: 600;
    border-radius: 10px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;

      label {
        color: #b8b8d4;
        font-weight: 600;
        font-size: 0.9rem;
      }

      input, select, textarea {
        padding: 0.7rem 1rem;
        border-radius: 12px;
        background: #181a27;
        border: 1px solid rgba(255,255,255,0.08);
        color: #e4e4f0;
        font-size: 1rem;
        outline: none;
        transition: 0.25s;

        &:focus {
          border-color: #6c63ff;
          box-shadow: 0 0 8px rgba(108, 99, 255, 0.4);
        }
      }

      textarea { resize: none; }
      select { cursor: pointer; }
    }
  }

  .date-picker {
    width: 100%;
  }

  @media (max-width: 600px) {
    .form-card { padding: 1.5rem; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default IncomeFormWithHistory;
