import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function Transactions() {
  const { getIncomes, getExpenses, incomes, expenses } = useGlobalContext();
  const [yearlyData, setYearlyData] = useState([]);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, [getIncomes, getExpenses]);

  useEffect(() => {
    const years = {};

    incomes.forEach((inc) => {
      const date = new Date(inc.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (!years[year]) years[year] = { incomes: {}, expenses: {} };
      years[year].incomes[month] = years[year].incomes[month] || [];
      years[year].incomes[month].push(inc);
    });

    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (!years[year]) years[year] = { incomes: {}, expenses: {} };
      years[year].expenses[month] = years[year].expenses[month] || [];
      years[year].expenses[month].push(exp);
    });

    const data = Object.keys(years)
      .map((year) => ({
        year,
        months: Array.from({ length: 12 }, (_, i) => i)
          .filter(
            (i) =>
              (years[year].incomes[i]?.length || 0) > 0 ||
              (years[year].expenses[i]?.length || 0) > 0
          )
          .map((month) => ({
            month,
            incomes: years[year].incomes[month] || [],
            expenses: years[year].expenses[month] || [],
            totalIncome: (years[year].incomes[month] || []).reduce(
              (acc, t) => acc + t.amount,
              0
            ),
            totalExpense: (years[year].expenses[month] || []).reduce(
              (acc, t) => acc + t.amount,
              0
            ),
          })),
        totalIncome: Object.values(years[year].incomes)
          .flat()
          .reduce((acc, t) => acc + t.amount, 0),
        totalExpense: Object.values(years[year].expenses)
          .flat()
          .reduce((acc, t) => acc + t.amount, 0),
      }))
      .sort((a, b) => b.year - a.year);

    setYearlyData(data);

    if (data.length > 0) {
      const lastYear = data[0];
      if (lastYear.totalExpense > lastYear.totalIncome) {
        setWarning(`⚠ Warning: You spent more than your income in ${lastYear.year}!`);
      } else {
        setWarning("");
      }
    }
  }, [incomes, expenses]);

  return (
    <TransactionsStyled>
      {warning && <Warning>{warning}</Warning>}

      {yearlyData.map((yearItem) => (
        <YearBlock key={yearItem.year}>
          <YearTitle>{yearItem.year}</YearTitle>
          {yearItem.months.map((monthItem) => (
            <MonthBlock key={monthItem.month}>
              <MonthTitle>{monthNames[monthItem.month]}</MonthTitle>
              <div className="transactions">
                {monthItem.incomes.map((inc) => (
                  <Transaction key={inc._id} type="income">
                    <div className="left">
                      <p className="title">{inc.title}</p>
                      <p className="category">{inc.category}</p>
                    </div>
                    <div className="right">
                      <p className="amount">+ ₹{inc.amount}</p>
                      <p className="date">{new Date(inc.date).toLocaleDateString()}</p>
                    </div>
                  </Transaction>
                ))}
                {monthItem.expenses.map((exp) => (
                  <Transaction key={exp._id} type="expense">
                    <div className="left">
                      <p className="title">{exp.title}</p>
                      <p className="category">{exp.category}</p>
                    </div>
                    <div className="right">
                      <p className="amount">- ₹{exp.amount}</p>
                      <p className="date">{new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                  </Transaction>
                ))}
              </div>
              <MonthTotals>
                <span>Total Income: ₹{monthItem.totalIncome}</span>
                <span>Total Expense: ₹{monthItem.totalExpense}</span>
                <span>
                  Savings: ₹{monthItem.totalIncome - monthItem.totalExpense}
                </span>
              </MonthTotals>
            </MonthBlock>
          ))}
          <YearTotals>
            <span>Total Income: ₹{yearItem.totalIncome}</span>
            <span>Total Expense: ₹{yearItem.totalExpense}</span>
            <span>Savings: ₹{yearItem.totalIncome - yearItem.totalExpense}</span>
          </YearTotals>
        </YearBlock>
      ))}
    </TransactionsStyled>
  );
}

export default Transactions;

// ========== STYLED COMPONENTS ==========
const TransactionsStyled = styled.div`
  padding: 2rem;
  background: #1e1e2f;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Warning = styled.div`
  text-align: center;
  background: #330000;
  color: #ff4b2b;
  font-weight: 600;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
`;

const YearBlock = styled.div`
  background: #2b2b3d;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  box-shadow: 0 6px 15px rgba(0,0,0,0.4);
`;

const YearTitle = styled.h2`
  font-size: 1.8rem;
  color: #f0f0ff;
  margin-bottom: 1rem;
  text-align: center;
`;

const MonthBlock = styled.div`
  margin-bottom: 1.5rem;
  border-top: 1px dashed #555;
  padding-top: 0.5rem;
`;

const MonthTitle = styled.h3`
  font-size: 1.3rem;
  color: #ddd;
  margin-bottom: 0.5rem;
`;

const Transaction = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${(props) => (props.type === "income" ? "#22332255" : "#55222255")};
  border-left: 5px solid ${(props) => (props.type === "income" ? "#42AD00" : "#F56692")};
  padding: 0.7rem 1rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;

  .left {
    display: flex;
    flex-direction: column;
    color: #ddd;
  }
  .right {
    text-align: right;
    color: #ddd;
  }
  .title {
    font-weight: 600;
    font-size: 1rem;
  }
  .category {
    font-size: 0.85rem;
    color: #bbb;
  }
  .amount {
    font-weight: bold;
    color: ${(props) => (props.type === "income" ? "#42AD00" : "#F56692")};
  }
  .date {
    font-size: 0.75rem;
    color: #aaa;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.7);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    .right { text-align: left; margin-top: 0.3rem; }
  }
`;

const MonthTotals = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.3rem;
  span {
    font-weight: 600;
    padding: 0.3rem 0.7rem;
    border-radius: 8px;
    background: #444466;
    color: #fff;
  }
`;

const YearTotals = styled(MonthTotals)`
  justify-content: center;
  margin-top: 1rem;
  font-size: 1rem;
  span {
    font-size: 1rem;
  }
`;
