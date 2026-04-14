import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import ExpenseForm from "./ExpenseForm";
import IncomeItem from "../IncomeItem/IncomeItem";

function Expenses() {
  const { expenses, getExpenses, deleteExpense, totalExpenses } =
    useGlobalContext();

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  return (
    <ExpensesStyled>
      <InnerLayout>
        <h1 className="page-title">Expenses</h1>

        <div className="summary-card glass">
          <h2>Total Expense</h2>
          <p className="amount">₹{totalExpenses()}</p>
        </div>

        <div className="content-grid">
          {/* Form Section */}
          <div className="left glass">
            <ExpenseForm />
          </div>

          {/* List Section */}
          <div className="right glass">
            <h2 className="list-heading">All Expenses</h2>

            <div className="expense-list">
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <IncomeItem
                    key={expense._id}
                    {...expense}
                    indicatorColor="var(--color-delete)"
                    deleteItem={deleteExpense}
                  />
                ))
              ) : (
                <p className="no-expenses">No expenses recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </InnerLayout>
    </ExpensesStyled>
  );
}

const ExpensesStyled = styled.div`
  .page-title {
    text-align: center;
    font-size: 2rem;
    color: #222260;
    margin-bottom: 1.5rem;
    font-weight: 700;
  }

.summary-card .amount {
  /* Fluid Typography: 
     - Min: 1.5rem (Mobile)
     - Scale: 4vw (Scales with screen width)
     - Max: 2.5rem (Desktop)
  */
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  
  font-weight: 700;
  color: #222260;
  
  /* Prevent long numbers from breaking the layout */
  word-break: break-all; 
  overflow-wrap: break-word;
  
  /* Ensure it stays centered or aligned properly */
  display: block;
  line-height: 1.2;
}

/* Specific adjustments for very small phones */
@media (max-width: 400px) {
  .summary-card .amount {
    letter-spacing: -1px; /* Tighten text to fit more numbers */
  }
}
`;

export default Expenses;
