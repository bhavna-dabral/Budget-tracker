import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { Bar } from "react-chartjs-2";
import { useGlobalContext } from "../context/globalContext";

/* ---------------- SAFE DATE PARSER ---------------- */

const parseDate = (d) => {
  if (!d) return null;

  if (d instanceof Date) {
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof d === "string" && /^\d{1,2}-\d{1,2}-\d{4}$/.test(d.trim())) {
    const [dd, mm, yyyy] = d.trim().split("-").map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    return isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
};

function AnalyticsChart() {
  const { incomes = [], expenses = [] } = useGlobalContext();

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  /* ---------------- AVAILABLE YEARS ---------------- */

  const availableYears = useMemo(() => {
    const years = new Set();

    [...incomes, ...expenses].forEach((it) => {
      const dt = parseDate(it.date);
      if (dt) years.add(dt.getFullYear());
    });

    if (years.size === 0) years.add(new Date().getFullYear());

    return Array.from(years).sort((a, b) => b - a);
  }, [incomes, expenses]);

  /* ---------------- SAFE STATE INIT ---------------- */

  const [selectedYear, setSelectedYear] = useState(
    () => availableYears[0] || new Date().getFullYear()
  );

  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0] || new Date().getFullYear());
    }
  }, [availableYears, selectedYear]);

  /* ---------------- MONTHLY SUMS ---------------- */

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

  /* ---------------- DERIVED DATA ---------------- */

  const derived = useMemo(() => {
    const monthlyIncome = monthlySums(incomes, selectedYear);
    const monthlyExpense = monthlySums(expenses, selectedYear);

    const totalIncomeYear = monthlyIncome.reduce((a, b) => a + b, 0);
    const totalExpenseYear = monthlyExpense.reduce((a, b) => a + b, 0);
    const totalSavingsYear = totalIncomeYear - totalExpenseYear;

    const overspentMonths = months.filter(
      (_, i) => monthlyExpense[i] > monthlyIncome[i]
    );

    let lastMonthIndex = -1;

    for (let i = 11; i >= 0; i--) {
      if (monthlyIncome[i] + monthlyExpense[i] > 0) {
        lastMonthIndex = i;
        break;
      }
    }

    let monthlyWarning = null;

    if (lastMonthIndex > 0) {
      const lastExp = monthlyExpense[lastMonthIndex];
      const prevExp = monthlyExpense[lastMonthIndex - 1];

      if (prevExp > 0 && lastExp > prevExp) {
        const pct = ((lastExp - prevExp) / prevExp) * 100;

        monthlyWarning = {
          month: months[lastMonthIndex],
          prevMonth: months[lastMonthIndex - 1],
          pct: pct.toFixed(1),
        };
      }
    }

    return {
      monthlyIncome,
      monthlyExpense,
      totalIncomeYear,
      totalExpenseYear,
      totalSavingsYear,
      overspentMonths,
      monthlyWarning,
    };
  }, [incomes, expenses, selectedYear]);

  /* ---------------- CHART DATA ---------------- */

  const data = {
    labels: months,
    datasets: [
      {
        type: "line",
        label: "Income",
        data: derived.monthlyIncome,
        borderColor: "#00e676",
        backgroundColor: "rgba(0,230,118,0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        type: "bar",
        label: "Expense",
        data: derived.monthlyExpense,
        backgroundColor: "#ff6b6b",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) => `₹${v}`,
        },
      },
    },
  };

  return (
    <ChartWrap>
      <Header>
        <div>
          <h2>Analytics</h2>
          <p>Monthly Summary for {selectedYear}</p>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </Header>

      <ChartBox>
        <Bar data={data} options={options} />
      </ChartBox>

      <Stats>
        <p>Income: ₹{derived.totalIncomeYear.toLocaleString()}</p>
        <p>Expense: ₹{derived.totalExpenseYear.toLocaleString()}</p>
        <p>Balance: ₹{derived.totalSavingsYear.toLocaleString()}</p>
      </Stats>

      <Warnings>
        {derived.monthlyWarning ? (
          <div>⚠ {derived.monthlyWarning.month} expenses increased</div>
        ) : (
          <div>✅ Spending is stable</div>
        )}

        {derived.overspentMonths.length > 0 && (
          <div>💸 Overspent: {derived.overspentMonths.join(", ")}</div>
        )}
      </Warnings>
    </ChartWrap>
  );
}

/* ---------------- STYLES ---------------- */

const ChartWrap = styled.div`
  background: #212431;
  padding: 1rem;
  border-radius: 20px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ChartBox = styled.div`
  height: 300px;
`;

const Stats = styled.div`
  margin-top: 1rem;
`;

const Warnings = styled.div`
  margin-top: 1rem;
`;

export default AnalyticsChart;