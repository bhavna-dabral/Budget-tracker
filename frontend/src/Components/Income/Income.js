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
  flex-direction: column;

  h1 { text-align: center; margin-bottom: 1rem; }
  .total-expense { text-align: center; margin-bottom: 1.5rem; span { color: var(--color-delete); font-weight: 700; } }

  .income-content { display: flex; gap: 2rem; }
  .form-container { flex: 1; }
  .income-list { flex: 2; display: flex; flex-direction: column; gap: 1rem; }
  .no-expenses { text-align: center; color: rgba(34,34,96,0.6); margin-top: 2rem; }
`;


export default Income;