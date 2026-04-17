import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import ExpenseForm from './ExpenseForm';
import IncomeItem from '../IncomeItem/IncomeItem';

function Expenses() {
  const { expenses, getExpenses, deleteExpense, totalExpenses } = useGlobalContext();

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  return (
    <ExpensesStyled>
      <InnerLayout>
        <h1>Expenses</h1>

        {/* ✅ FIX: treat like value (same as income page) */}
        <h2 className="total-expense">
          Total Expense: <span>₹{totalExpenses}</span>
        </h2>

        <div className="expense-content">
          {/* LEFT → FORM */}
          <div className="form-container">
            <ExpenseForm />
          </div>

          {/* RIGHT → LIST */}
          <div className="expenses-list">
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
      </InnerLayout>
    </ExpensesStyled>
  );
}

const ExpensesStyled = styled.div`
  width: 100%;
  padding: 1rem;

  h1 {
    text-align: center;
    margin-bottom: 1rem;
    font-size: clamp(1.5rem, 5vw, 2.2rem);
    color: #222260;
  }

  .total-expense {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 16px;
    padding: 0.8rem;
    margin: 1rem 0;
    font-size: 1.2rem;
    flex-wrap: wrap;

    span {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--color-delete);
    }
  }

  /* 🔥 MAIN FIX */
  .expense-content {
    display: flex;
    flex-direction: column; /* ✅ MOBILE FIRST */
    gap: 1.5rem;
  }

  .form-container {
    width: 100%;
  }

  .expenses-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .no-expenses {
    text-align: center;
    color: rgba(34,34,96,0.6);
    margin-top: 2rem;
  }

  /* 💻 DESKTOP */
  @media screen and (min-width: 1024px) {
    .expense-content {
      flex-direction: row; /* ✅ side-by-side only on big screens */
      align-items: flex-start;
    }

    .form-container {
      flex: 1;
      max-width: 400px;
    }

    .expenses-list {
      flex: 2;
    }
  }

  /* 📱 MOBILE POLISH */
  @media screen and (max-width: 768px) {
    padding: 0.5rem;

    .total-expense {
      font-size: 1rem;

      span {
        font-size: 1.4rem;
      }
    }
  }
`;

export default Expenses;