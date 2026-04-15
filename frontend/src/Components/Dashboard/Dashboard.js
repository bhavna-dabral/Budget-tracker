// src/Components/Chart/Chart.jsx
import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useGlobalContext } from "../../context/globalContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

/* ---------------- Helpers ---------------- */

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

// ✅ SAFE DATE PARSER (FIXED)
const parseDate = (d) => {
  if (!d) return null;

  if (d instanceof Date) return isNaN(d.getTime()) ? null : d;

  if (typeof d === "string" && /^\d{1,2}-\d{1,2}-\d{4}$/.test(d.trim())) {
    const [dd, mm, yyyy] = d.trim().split("-").map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    return isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const monthlySums = (items, year) => {
  const arr = Array(12).fill(0);

  items.forEach((it) => {
    const dt = parseDate(it.date);

    if (dt && dt.getFullYear() === year) {
      arr[dt.getMonth()] += Number(it.amount || 0);
    }
  });

  return arr;
};

/* ---------------- Component ---------------- */

function Chart() {
  const { incomes = [], expenses = [] } = useGlobalContext();

  const availableYears = useMemo(() => {
    const years = new Set();

    incomes.forEach((it) => {
      const dt = parseDate(it.date);
      if (dt) years.add(dt.getFullYear());
    });

    expenses.forEach((it) => {
      const dt = parseDate(it.date);
      if (dt) years.add(dt.getFullYear());
    });

    if (years.size === 0) years.add(new Date().getFullYear());

    return Array.from(years).sort((a, b) => b - a);
  }, [incomes, expenses]);

  const [selectedYear, setSelectedYear] = useState(
    availableYears[0] || new Date().getFullYear()
  );

  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  /* ---------------- Derived Data ---------------- */

  const derived = useMemo(() => {
    const monthlyIncome = monthlySums(incomes, selectedYear);
    const monthlyExpense = monthlySums(expenses, selectedYear);

    const totalIncomeYear = monthlyIncome.reduce((a, b) => a + b, 0);
    const totalExpenseYear = monthlyExpense.reduce((a, b) => a + b, 0);

    const allIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
    const allExpense = expenses.reduce((s, i) => s + Number(i.amount || 0), 0);

    const walletAllTime = allIncome - allExpense;

    const overspentMonths = months.filter(
      (_, i) => monthlyExpense[i] > monthlyIncome[i]
    );

    const allYearsAsc = Array.from(
      new Set([
        ...incomes.map(i => parseDate(i.date)?.getFullYear()).filter(Boolean),
        ...expenses.map(e => parseDate(e.date)?.getFullYear()).filter(Boolean),
      ])
    ).sort((a, b) => a - b);

    const yearlyIncomeTotals = allYearsAsc.map((y) =>
      incomes.reduce((s, it) => {
        const dt = parseDate(it.date);
        return dt && dt.getFullYear() === y ? s + Number(it.amount || 0) : s;
      }, 0)
    );

    const yearlyExpenseTotals = allYearsAsc.map((y) =>
      expenses.reduce((s, it) => {
        const dt = parseDate(it.date);
        return dt && dt.getFullYear() === y ? s + Number(it.amount || 0) : s;
      }, 0)
    );

    return {
      monthlyIncome,
      monthlyExpense,
      totalIncomeYear,
      totalExpenseYear,
      walletAllTime,
      overspentMonths,
      allYearsAsc,
      yearlyIncomeTotals,
      yearlyExpenseTotals,
    };
  }, [incomes, expenses, selectedYear]);

  /* ---------------- Chart Data ---------------- */

  const mixedMonthlyData = useMemo(() => ({
    labels: months,
    datasets: [
      {
        type: "bar",
        label: "Expense",
        data: derived.monthlyExpense,
        backgroundColor: "#ff6b6b",
        borderRadius: 6,
      },
      {
        type: "line",
        label: "Income",
        data: derived.monthlyIncome,
        borderColor: "#00e676",
        tension: 0.3,
        borderWidth: 3,
      },
    ],
  }), [derived]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString()}`;

  return (
    <Wrap>
      <h2>Analytics</h2>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        {availableYears.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <ChartBox>
        <Bar data={mixedMonthlyData} options={chartOptions} />
      </ChartBox>

      <div>
        <p>Total Income: {fmt(derived.totalIncomeYear)}</p>
        <p>Total Expense: {fmt(derived.totalExpenseYear)}</p>
        <p>Wallet: {fmt(derived.walletAllTime)}</p>
      </div>

      <div>
        {derived.overspentMonths.length > 0 ? (
          <p>⚠ Overspent: {derived.overspentMonths.join(", ")}</p>
        ) : (
          <p>✅ No overspending months</p>
        )}
      </div>
    </Wrap>
  );
}

/* ---------------- Styles ---------------- */

const Wrap = styled.div`
  padding: 20px;
  color: #fff;
  background: #0b1726;
`;

const ChartBox = styled.div`
  height: 350px;
  margin-top: 20px;
`;

export default Chart;