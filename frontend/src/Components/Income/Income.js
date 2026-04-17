import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Form from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';

function Income() {
  // Destructure from Global Context
  const { incomes, getIncomes, deleteIncome, totalIncome } = useGlobalContext();

  // Fetch incomes when component mounts
  useEffect(() => {
    getIncomes();
  }, [getIncomes]);

  return (
    <IncomeStyled>
      <InnerLayout>
        <h1>Incomes</h1>

        {/* ✅ FIXED: Removed the () from totalIncome. It is a value, not a function. */}
        <h2 className="total-income">
          Total Income: <span>₹{totalIncome}</span>
        </h2>

        <div className="income-content">
          <div className="form-container">
            {/* The form to add new income */}
            <Form />
          </div>

          <div className="incomes-list">
            {incomes.length > 0 ? (
              incomes.map((income) => {
                const { _id, title, amount, date, category, description, type } = income;
                return (
                  <IncomeItem
                    key={_id}
                    id={_id}
                    title={title}
                    description={description}
                    amount={amount}
                    date={date}
                    type={type}
                    category={category}
                    indicatorColor="var(--color-green)"
                    deleteItem={deleteIncome}
                  />
                );
              })
            ) : (
              <p className="no-incomes">No incomes recorded yet.</p>
            )}
          </div>
        </div>
      </InnerLayout>
    </IncomeStyled>
  );
}

const IncomeStyled = styled.div`
  display: flex;
  overflow: auto;

  h1 {
    text-align: center;
    margin-bottom: 1rem;
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    color: #222260;
  }

  .total-income {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    font-size: 1.5rem;
    gap: 0.5rem;
    span {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-green);
    }
  }

  .income-content {
    display: flex;
    gap: 2rem;
    flex-direction: column;

    @media screen and (min-width: 1024px) {
      flex-direction: row;
    }

    .form-container {
      flex: 1;
      width: 100%;
    }

    .incomes-list {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
  }

  @media screen and (max-width: 768px) {
    .total-income {
      font-size: 1.2rem;
      span {
        font-size: 1.5rem;
      }
    }
  }
`;

export default Income;