import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import Chart from "../Chart/Chart";
import { dollar } from "../../utils/Icons";

function Dashboard() {
  const {
    totalIncome,
    totalExpenses,
    totalBalance,
    getIncomes,
    getExpenses,
    transactionHistory,
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, [getIncomes, getExpenses]);

  const history = transactionHistory();

  return (
    <DashboardStyled>
      <InnerLayout>
        <h1>📊 Dashboard Overview</h1>

        {/* === Summary Section === */}
        <div className="summary-grid">
          <div className="card income">
            <h3>Total Income</h3>
            <p>₹{totalIncome()}</p>
          </div>
          <div className="card expense">
            <h3>Total Expense</h3>
            <p>₹{totalExpenses()}</p>
          </div>
          <div className="card balance">
            <h3>Total Balance</h3>
            <p>₹{totalBalance()}</p>
          </div>
        </div>

        {/* === Chart Section === */}
        <div className="chart-card">
          <Chart />
        </div>

        {/* === Recent Transactions === */}
        <div className="history-section">
          <h2>Recent Transactions</h2>

          {history.length > 0 ? (
            <div className="transactions">
              {history.map((item) => (
                <div
                  key={item._id}
                  className={`transaction ${item.type}`}
                >
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
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  h1 {
    font-size: 2rem;
    color: #222260;
    margin-bottom: 2.5rem;
    text-align: center;
  }

  /* === Summary Grid === */
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    .card {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      text-align: center;
      transition: 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      }

      h3 {
        color: #555;
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 1.6rem;
        font-weight: 700;
      }

      &.income p {
        color: #00b09b;
      }

      &.expense p {
        color: #ff4b2b;
      }

      &.balance p {
        color: #007bff;
      }
    }
  }

  /* === Chart Card === */
  .chart-card {
    background: #fff;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 3rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  /* === Recent Transactions === */
  .history-section {
    h2 {
      font-size: 1.4rem;
      color: #222260;
      margin-bottom: 1.5rem;
    }

    .transactions {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .transaction {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border-left: 5px solid transparent;
        border-radius: 12px;
        padding: 1rem 1.2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        transition: 0.3s ease;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
        }

        &.income {
          border-left-color: #00b09b;
        }

        &.expense {
          border-left-color: #ff4b2b;
        }

        .left {
          .title {
            font-weight: 600;
            color: #222260;
          }

          .category {
            font-size: 0.85rem;
            color: #777;
          }
        }

        .right {
          text-align: right;

          .amount {
            font-weight: 600;
            color: #222260;
          }

          .date {
            font-size: 0.8rem;
            color: #888;
          }
        }
      }
    }

    .no-transactions {
      text-align: center;
      color: #777;
      font-style: italic;
      background: #fff;
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }
`;

export default Dashboard;