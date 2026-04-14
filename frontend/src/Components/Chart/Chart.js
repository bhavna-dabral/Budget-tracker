import React, { useState } from "react";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Chart() {
  const { incomes, expenses } = useGlobalContext();
  const [chartType, setChartType] = useState("monthly"); // monthly | yearly | pie

  // -----------------------------
  // MONTHLY GROUPING
  // -----------------------------
  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);

  incomes.forEach((inc) => {
    const m = new Date(inc.date).getMonth();
    monthlyIncome[m] += inc.amount;
  });

  expenses.forEach((exp) => {
    const m = new Date(exp.date).getMonth();
    monthlyExpense[m] += exp.amount;
  });

  // -----------------------------
  // YEARLY STATS
  // -----------------------------
  const totalIncomeYear = incomes.reduce((acc, inc) => acc + inc.amount, 0);
  const totalExpenseYear = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  // -----------------------------
  // PIE CHART CATEGORIES
  // -----------------------------
  const categoryTotals = {};
  expenses.forEach((exp) => {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const pieLabels = Object.keys(categoryTotals);
  const pieValues = Object.values(categoryTotals);

  // -----------------------------
  // BUDGET WARNINGS
  // -----------------------------
  let warningMsg = "";
  let warningColor = "";

  if (totalExpenseYear > totalIncomeYear * 0.8) {
    warningMsg = "⚠️ You are spending more than 80% of your yearly income!";
    warningColor = "#ff4d4d"; // red
  } else if (totalExpenseYear > totalIncomeYear * 0.5) {
    warningMsg = "⚠️ Your expenses exceeded 50% of your income.";
    warningColor = "#ffcc00"; // yellow
  }

  // -----------------------------
  // MONTHLY CHART DATA
  // -----------------------------
  const monthlyData = {
    labels: monthNames,
    datasets: [
      {
        label: "Monthly Income",
        data: monthlyIncome,
        backgroundColor: "rgba(66, 173, 0, 0.4)",
        borderColor: "#42AD00",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Monthly Expense",
        data: monthlyExpense,
        backgroundColor: "rgba(245, 102, 146, 0.4)",
        borderColor: "#F56692",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // -----------------------------
  // YEARLY BAR CHART DATA
  // -----------------------------
  const yearlyData = {
    labels: ["Total Income", "Total Expense"],
    datasets: [
      {
        label: "Yearly Summary",
        data: [totalIncomeYear, totalExpenseYear],
        backgroundColor: ["#42AD00", "#F56692"],
      },
    ],
  };

  // -----------------------------
  // PIE CHART DATA
  // -----------------------------
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieValues,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF9800",
          "#9C27B0",
          "#03A9F4",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <ChartStyled>
      {/* Budget Warning */}
      {warningMsg && (
        <div className="warning-box" style={{ background: warningColor }}>
          {warningMsg}
        </div>
      )}

      {/* Chart Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={chartType === "monthly" ? "active" : ""}
          onClick={() => setChartType("monthly")}
        >
          📅 Monthly
        </button>

        <button
          className={chartType === "yearly" ? "active" : ""}
          onClick={() => setChartType("yearly")}
        >
          📆 Yearly
        </button>

        <button
          className={chartType === "pie" ? "active" : ""}
          onClick={() => setChartType("pie")}
        >
          🥧 Pie Chart
        </button>
      </div>

      {/* Chart Display */}
      <div className="chart-container">
        {chartType === "monthly" && <Line data={monthlyData} options={options} />}
        {chartType === "yearly" && <Bar data={yearlyData} options={options} />}
        {chartType === "pie" && <Pie data={pieData} options={options} />}
      </div>
    </ChartStyled>
  );
}

// -----------------------------
// STYLES
// -----------------------------
const ChartStyled = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0px 1px 14px rgba(0,0,0,0.1);
  width: 100%;
  height: 480px;

  .warning-box {
    padding: 12px;
    color: #fff;
    font-weight: bold;
    text-align: center;
    border-radius: 10px;
    margin-bottom: 1rem;
    animation: fadeIn 0.4s ease-in-out;
  }

  .filter-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    button {
      padding: 0.5rem 1rem;
      background: #ececec;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.3s;

      &.active {
        background: #222260;
        color: white;
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .chart-container {
    width: 100%;
    height: 85%;
  }

  @media (max-width: 600px) {
    height: 420px;

    .filter-buttons {
      flex-direction: column;
    }
  }
`;

export default Chart;
