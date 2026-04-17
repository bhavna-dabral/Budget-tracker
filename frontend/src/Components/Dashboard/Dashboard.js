import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import Chart from "../Chart/Chart";
import { exportToPDF } from "../../utils/exportPDF";

function Dashboard() {
  const {
    totalIncome,
    totalExpenses,
    totalBalance,
    getIncomes,
    getExpenses,
    incomes,
    expenses,
    transactionHistory,
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, [getIncomes, getExpenses]);

  const history = transactionHistory();

  // =========================
  // 📅 MONTHLY LOGIC
  // =========================
  const currentMonth = new Date().getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const getMonthlyTotal = (data, month) => {
    return data
      .filter(item => new Date(item.date).getMonth() === month)
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);
  };

  const currentExpense = getMonthlyTotal(expenses, currentMonth);
  const lastExpense = getMonthlyTotal(expenses, lastMonth);
  const currentIncome = getMonthlyTotal(incomes, currentMonth);

  const isSpendingIncreased = currentExpense > lastExpense;

  const changePercent = lastExpense
    ? ((currentExpense - lastExpense) / lastExpense * 100).toFixed(1)
    : 0;

  const savingsRate = currentIncome
    ? ((currentIncome - currentExpense) / currentIncome * 100).toFixed(1)
    : 0;

  // =========================
  // 🧠 TOP CATEGORY
  // =========================
  const categoryMap = {};
  expenses.forEach(item => {
    categoryMap[item.category] =
      (categoryMap[item.category] || 0) + Number(item.amount || 0);
  });

  const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

  // =========================
  // 💰 FORMATTER
  // =========================
  const format = (num) => `₹${Number(num || 0).toLocaleString()}`;

  return (
    <DashboardStyled>
      <InnerLayout>

        {/* 📄 EXPORT BUTTON */}
        <div className="export-btn">
          <button onClick={() => exportToPDF("dashboard-report")}>
            Download Report 📄
          </button>
        </div>

        {/* 📊 WRAP EVERYTHING FOR PDF */}
        <div id="dashboard-report">

          <h1>📊 Dashboard Overview</h1>

          {/* ⚠️ WARNING */}
          {isSpendingIncreased && (
            <div className="warning-box">
              ⚠️ Spending increased by {changePercent}% compared to last month
            </div>
          )}

          {/* === SUMMARY === */}
          <div className="summary-grid">
            <div className="card income">
              <h3>Total Income</h3>
              <p>{format(totalIncome)}</p>
            </div>

            <div className="card expense">
              <h3>Total Expense</h3>
              <p>{format(totalExpenses)}</p>
            </div>

            <div className="card balance">
              <h3>Total Balance</h3>
              <p>{format(totalBalance)}</p>
            </div>

            <div className="card">
              <h3>This Month Expense</h3>
              <p>{format(currentExpense)}</p>
            </div>

            <div className="card">
              <h3>This Month Income</h3>
              <p>{format(currentIncome)}</p>
            </div>

            <div className="card">
              <h3>Savings Rate</h3>
              <p>{savingsRate}%</p>
            </div>
          </div>

          {/* 🧠 INSIGHTS */}
          <div className="insight-box">
            {topCategory ? (
              <p>
                💸 Highest spending on: <strong>{topCategory[0]}</strong>
              </p>
            ) : (
              <p>No insights yet</p>
            )}
          </div>

          {/* 📊 CHART */}
          <div className="chart-card">
            <Chart />
          </div>

          {/* 🧾 HISTORY */}
          <div className="history-section">
            <h2>Recent Transactions</h2>

            {history.length > 0 ? (
              <div className="transactions">
                {history.map((item) => (
                  <div key={item._id} className={`transaction ${item.type}`}>
                    <div className="left">
                      <p className="title">{item.title}</p>
                      <p className="category">{item.category}</p>
                    </div>

                    <div className="right">
                      <p className="amount">
                        {item.type === "income" ? "+" : "-"} ₹{item.amount}
                      </p>
                      <p className="date">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-transactions">No transactions yet.</p>
            )}
          </div>

        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

/* =========================
   🎨 STYLES
========================= */
const DashboardStyled = styled.div`

  .export-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;

    button {
      padding: 8px 14px;
      border-radius: 8px;
      border: none;
      background: #6c63ff;
      color: white;
      cursor: pointer;
      font-size: 0.9rem;

      &:hover {
        background: #574fd6;
      }
    }
  }

  h1 {
    font-size: 2rem;
    color: #222260;
    margin-bottom: 2rem;
    text-align: center;
  }

  .warning-box {
    background: rgba(255, 165, 0, 0.15);
    border-left: 4px solid orange;
    padding: 10px;
    border-radius: 10px;
    color: orange;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .insight-box {
    background: #fff;
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 500;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;

    .card {
      background: #fff;
      border-radius: 16px;
      padding: 1.2rem;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      h3 {
        color: #555;
        font-size: 0.9rem;
      }

      p {
        font-size: 1.3rem;
        font-weight: 700;
      }
    }

    .income p { color: #00b09b; }
    .expense p { color: #ff4b2b; }
    .balance p { color: #007bff; }
  }

  .chart-card {
    background: #fff;
    border-radius: 16px;
    padding: 1rem;
    margin-bottom: 2rem;
    overflow-x: auto;
  }

  .transactions {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .transaction {
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 0.8rem;
    border-radius: 10px;
    font-size: 0.9rem;

    .amount {
      font-weight: 600;
    }
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 1.5rem;
    }

    .summary-grid {
      grid-template-columns: 1fr;
    }

    .transaction {
      flex-direction: column;
      gap: 0.3rem;
    }
  }
`;

export default Dashboard;