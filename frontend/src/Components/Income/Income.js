import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Form from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';

function Income() {
  const { incomes, getIncomes, deleteIncome, totalIncome } = useGlobalContext();

  useEffect(() => {
    getIncomes();
  }, [getIncomes]);

  return (
    <IncomeStyled>
      <InnerLayout>
        <h1>Incomes</h1>

        <h2 className="total-income">
          Total Income: <span>₹{totalIncome()}</span>
        </h2>

        <div className="income-content">
          <div className="form-container">
            <Form />
          </div>

          <div className="incomes-list">
            {incomes.length > 0 ? (
              incomes.map((income) => (
                <IncomeItem
                  key={income._id}
                  {...income}
                  indicatorColor="var(--color-green)"
                  deleteItem={deleteIncome}
                />
              ))
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
    font-size: clamp(1.5rem, 5vw, 2.5rem); // Responsive font size
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
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-green);
    }
  }

  .income-content {
    display: flex;
    gap: 2rem;
    
    /* Mobile First: Stack vertically by default */
    flex-direction: column;

    /* Tablet and Desktop: Side by side */
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

  /* Responsive Adjustments for Mobile Devices */
  @media screen and (max-width: 768px) {
    .total-income {
      font-size: 1.2rem;
      span {
        font-size: 1.5rem;
      }
    }
    
    .income-content {
        gap: 1.5rem;
    }
  }
`;


export default Income;