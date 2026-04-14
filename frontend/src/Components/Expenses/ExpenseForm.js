import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";

function ExpenseForm() {
  const { addExpense, error, setError, totalExpenses, totalIncome } =
    useGlobalContext();

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

  // Monthly Overspending Warning
  const [warning, setWarning] = useState("");
  useEffect(() => {
    const expense = Number(totalExpenses());
    const income = Number(totalIncome());
    if (income === 0) return;
    const ratio = (expense / income) * 100;
    if (ratio > 90) setWarning("⚠ You spent more than 90% of your monthly income!");
    else if (ratio > 70) setWarning("⚠ Your expenses crossed 70%. Be careful!");
    else setWarning("");
  }, [totalExpenses(), totalIncome()]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date || !category) {
      setError("Please fill in all fields.");
      return;
    }
    addExpense(inputState);
    setInputState({ title: "", amount: "", date: null, category: "", description: "" });
  };

  return (
    <FormContainer>
      <div className="form-card">
        <h2>Add Expense</h2>
        {warning && <p className="warning">{warning}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Expense Title</label>
            <input
              type="text"
              value={title}
              placeholder="e.g. Grocery Shopping"
              onChange={handleInput("title")}
            />
          </div>

          <div className="input-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              placeholder="Enter amount"
              min="0"
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
              <option value="education">Education</option>
              <option value="groceries">Groceries</option>
              <option value="health">Health</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="takeaways">Takeaways</option>
              <option value="clothing">Clothing</option>
              <option value="travelling">Travelling</option>
              <option value="food">Food</option>
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
            name="Add Expense"
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
    background: #11121c;
    padding: 2rem;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 25px rgba(108, 99, 255, 0.2);
    animation: fadeIn 0.4s ease-in-out;

    h2 {
      text-align: center;
      color: #fff;
      margin-bottom: 1.5rem;
      font-size: 1.7rem;
      font-weight: 700;
    }
  }

  .warning, .error {
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    font-weight: 600;
    border-radius: 10px;
  }

  .warning {
    background: rgba(255, 193, 7, 0.15);
    border-left: 4px solid #ffc107;
    color: #ffc107;
  }

  .error {
    background: rgba(255, 82, 82, 0.15);
    border-left: 4px solid #ff5252;
    color: #ff5252;
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
        border-radius: 10px;
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

    .date-picker {
      width: 100%;
    }
  }

  @media (max-width: 600px) {
    .form-card { padding: 1.5rem; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default ExpenseForm;
