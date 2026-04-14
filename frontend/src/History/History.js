import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

function History() {
  const { transactions } = useGlobalContext(); // assume it includes income & expense
  const [tab, setTab] = useState("dashboard"); // dashboard | income | expense

  const filteredTransactions = transactions.filter((t) => {
    if (tab === "income") return t.type === "income";
    if (tab === "expense") return t.type === "expense";
    return true; // dashboard shows all
  });

  return (
    <HistoryStyled>
      <div className="tabs">
        <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
        <button className={tab === "income" ? "active" : ""} onClick={() => setTab("income")}>Income</button>
        <button className={tab === "expense" ? "active" : ""} onClick={() => setTab("expense")}>Expense</button>
      </div>

      <div className="history-list">
        {filteredTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          filteredTransactions.map((item) => (
            <div className="history-item" key={item.id}>
              <div className="left">
                <p className="title">{item.title}</p>
                <p className="category">{item.category}</p>
              </div>
              <div className="right">
                <p className={`amount ${item.type}`}>{item.type === "income" ? "+" : "-"}${item.amount}</p>
                <p className="date">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </HistoryStyled>
  );
}

const HistoryStyled = styled.div`
  padding: 1rem;
  .tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1rem;

    button {
      padding: 0.5rem 1rem;
      background: #eee;
      border: none;
      border-radius: 20px;
      font-weight: 500;
      cursor: pointer;
      &.active {
        background: var(--color-accent);
        color: #fff;
      }
    }
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .history-item {
      display: flex;
      justify-content: space-between;
      background: #fcf6f9;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      box-shadow: 0px 1px 5px rgba(0,0,0,0.05);

      .left {
        display: flex;
        flex-direction: column;
        .title {
          font-weight: 600;
        }
        .category {
          font-size: 0.85rem;
          color: #666;
        }
      }

      .right {
        text-align: right;
        .amount {
          font-weight: 600;
          &.income { color: green; }
          &.expense { color: red; }
        }
        .date {
          font-size: 0.75rem;
          color: #999;
        }
      }
    }
  }

  @media (max-width: 600px) {
    padding: 0.75rem;
    .tabs {
      button {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
      }
    }
    .history-list .history-item {
      padding: 0.5rem 0.75rem;
      .left .title { font-size: 0.9rem; }
      .left .category { font-size: 0.75rem; }
      .right .amount { font-size: 0.9rem; }
      .right .date { font-size: 0.7rem; }
    }
  }
`;

export default History;
