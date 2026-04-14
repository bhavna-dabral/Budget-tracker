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

  /* === Summary Card === */
  .summary-card {
    width: 100%;
    max-width: 350px;
    margin: 0 auto 2rem auto;
    padding: 1.2rem;
    text-align: center;
    border-radius: 18px;

    h2 {
      font-size: 1rem;
      color: #444;
    }

    .amount {
      margin-top: 0.4rem;
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--color-delete);
    }
  }

  /* === Main Content Grid === */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 2rem;
  }

  .left,
  .right {
    padding: 1.5rem;
    border-radius: 20px;
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.08),
      inset 0px 1px 2px rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  /* === Expense List === */
  .list-heading {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 700;
    color: #222260;
  }

  .expense-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 8px;
  }

  .no-expenses {
    text-align: center;
    font-style: italic;
    color: rgba(34, 34, 96, 0.6);
    padding-top: 1rem;
  }

  /* === Scrollbar Style === */
  .expense-list::-webkit-scrollbar {
    width: 6px;
  }
  .expense-list::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }

  /* === Responsive === */
  @media (max-width: 900px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    .left,
    .right {
      padding: 1rem;
    }

    .summary-card {
      margin-top: 1rem;
    }
  }

  @media (max-width: 550px) {
    .page-title {
      font-size: 1.5rem;
    }

    .summary-card .amount {
      font-size: 1.5rem;
    }
  }
`;

export default Expenses;
