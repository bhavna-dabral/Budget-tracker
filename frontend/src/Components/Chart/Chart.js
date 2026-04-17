import React, { useState } from "react";
import styled from "styled-components";
import { Bar } from "react-chartjs-2";
import { useGlobalContext } from "../../context/globalContext";
import { useAnalytics } from "../../hooks/useAnalytics";
import Loader from "../Loader";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Tooltip,
  Legend,
  Filler
);

function Chart() {
  const { incomes, expenses } = useGlobalContext();

  const safeIncomes = Array.isArray(incomes) ? incomes : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const analytics = useAnalytics(safeIncomes, safeExpenses);
  const [view, setView] = useState("monthly");

  if (safeIncomes.length === 0 && safeExpenses.length === 0) {
    return <Loader />;
  }

  /* ---------------- CHART OPTIONS (FIX MOBILE) ---------------- */
  const options = {
    responsive: true,
    maintainAspectRatio: false, // ⭐ IMPORTANT
    plugins: {
      legend: { position: "top" }
    },
  };

  /* ---------------- DATA ---------------- */
  const monthlyData = {
    labels: analytics.months,
    datasets: [
      {
        type: "line",
        label: "Income",
        data: analytics.monthlyIncome,
        borderColor: "#00e676",
        backgroundColor: "rgba(0,230,118,0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        type: "bar",
        label: "Expense",
        data: analytics.monthlyExpense,
        backgroundColor: "#ff6b6b",
        borderRadius: 6,
      },
    ],
  };

  const yearlyData = {
    labels: analytics.yearlyData.map((d) => d.year),
    datasets: [
      {
        label: "Income",
        data: analytics.yearlyData.map((d) => d.income),
        backgroundColor: "#00e676",
      },
      {
        label: "Expense",
        data: analytics.yearlyData.map((d) => d.expense),
        backgroundColor: "#ff6b6b",
      },
    ],
  };

  return (
    <ChartWrapper>
      {/* Toggle */}
      <div className="toggle">
        <button
          onClick={() => setView("monthly")}
          className={view === "monthly" ? "active" : ""}
        >
          Monthly
        </button>
        <button
          onClick={() => setView("yearly")}
          className={view === "yearly" ? "active" : ""}
        >
          Yearly
        </button>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <Bar
          data={view === "monthly" ? monthlyData : yearlyData}
          options={options}
        />
      </div>

      {/* Budget */}
      <div className="budget">
        <p>Budget Usage</p>
        <div className="bar">
          <div
            className="fill"
            style={{
              width: `${Math.min(analytics.budgetUsed || 0, 100)}%`,
            }}
          />
        </div>
        <span>{(analytics.budgetUsed || 0).toFixed(1)}%</span>
      </div>

      {/* Prediction */}
      <p className="prediction">
        📉 Next month prediction: ₹{Math.round(analytics.prediction || 0)}
      </p>

      {/* Insights */}
      <div className="insights">
        <h3>🧠 Smart Insights</h3>

        {analytics.monthlyWarning && (
          <p className="warning">
            ⚠ {analytics.monthlyWarning.month} increased by{" "}
            {analytics.monthlyWarning.pct}%
          </p>
        )}

        {analytics.overspentMonths?.length > 0 && (
          <p className="danger">
            💸 Overspent in: {analytics.overspentMonths.join(", ")}
          </p>
        )}

        {analytics.yearlyChange && (
          <p className="info">
            📊 Yearly change: {analytics.yearlyChange}%
          </p>
        )}

        {/* ⭐ FIX: fallback if empty */}
        {analytics.insights?.length > 0 ? (
          analytics.insights.map((text, i) => <p key={i}>• {text}</p>)
        ) : (
          <p>• No insights yet. Add more data.</p>
        )}
      </div>
    </ChartWrapper>
  );
}

/* ---------------- STYLES ---------------- */
const ChartWrapper = styled.div`
  padding: 1rem;

  .chart-container {
    height: 300px;
  }

  @media (max-width: 768px) {
    .chart-container {
      height: 220px; /* ⭐ mobile fix */
    }
  }

  .toggle {
    margin-bottom: 1rem;

    button {
      margin-right: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      background: #eee;

      &.active {
        background: #6c63ff;
        color: white;
      }
    }
  }

  .budget {
    margin-top: 1rem;

    .bar {
      height: 10px;
      background: #eee;
      border-radius: 10px;
      overflow: hidden;
    }

    .fill {
      height: 100%;
      background: linear-gradient(to right, #00e676, #ff6b6b);
    }
  }

  .prediction {
    margin-top: 1rem;
    font-weight: 500;
  }

  .insights {
    margin-top: 1.5rem;
    background: #f8f9ff;
    padding: 1rem;
    border-radius: 12px;
  }

  .warning { color: orange; }
  .danger { color: red; }
  .info { color: #4dabf7; }
`;

export default Chart;