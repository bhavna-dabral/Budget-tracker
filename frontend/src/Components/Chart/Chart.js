import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController, // <--- Add this
  BarController   // <--- Add this
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController, // <--- Register this
  BarController,  // <--- Register this
  Title,
  Tooltip,
  Legend,
  Filler
);

function AnalyticsChart() {
  const { incomes = [], expenses = [] } = useGlobalContext();

  const parseDate = (d) => {
    if (!d) return new Date("");
    if (d instanceof Date) return d;
    if (typeof d === "string" && /^\d{1,2}-\d{1,2}-\d{4}$/.test(d.trim())) {
      const [dd, mm, yyyy] = d.trim().split("-").map((s) => Number(s));
      return new Date(yyyy, mm - 1, dd);
    }
    return new Date(d);
  };

  const availableYears = useMemo(() => {
    const years = new Set();
    [...incomes, ...expenses].forEach((it) => {
      const dt = parseDate(it.date);
      if (!isNaN(dt.getTime())) years.add(dt.getFullYear());
    });
    if (years.size === 0) years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [incomes, expenses]);

  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const monthlySums = (items, year) => {
    const arr = Array(12).fill(0);
    items.forEach((it) => {
      const dt = parseDate(it.date);
      if (!isNaN(dt.getTime()) && dt.getFullYear() === year) {
        arr[dt.getMonth()] += Number(it.amount || 0);
      }
    });
    return arr;
  };

  const derived = useMemo(() => {
    const monthlyIncome = monthlySums(incomes, selectedYear);
    const monthlyExpense = monthlySums(expenses, selectedYear);
    const totalIncomeYear = monthlyIncome.reduce((s, v) => s + v, 0);
    const totalExpenseYear = monthlyExpense.reduce((s, v) => s + v, 0);
    const totalSavingsYear = totalIncomeYear - totalExpenseYear;

    const overspentMonths = months.filter((m, i) => monthlyExpense[i] > monthlyIncome[i]);

    let lastMonthIndex = -1;
    for (let i = 11; i >= 0; i--) {
      if (monthlyIncome[i] + monthlyExpense[i] > 0) { lastMonthIndex = i; break; }
    }
    
    let monthlyWarning = null;
    if (lastMonthIndex > 0) {
      const lastExp = monthlyExpense[lastMonthIndex];
      const prevExp = monthlyExpense[lastMonthIndex - 1];
      if (lastExp > prevExp && prevExp > 0) {
        const pct = ((lastExp - prevExp) / prevExp) * 100;
        monthlyWarning = { month: months[lastMonthIndex], prevMonth: months[lastMonthIndex - 1], pct: pct.toFixed(1) };
      }
    }

    return { monthlyIncome, monthlyExpense, totalIncomeYear, totalExpenseYear, totalSavingsYear, overspentMonths, monthlyWarning };
  }, [incomes, expenses, selectedYear]);

  const mixedMonthlyData = {
    labels: months,
    datasets: [
      {
        type: "line", // Line should usually be on top of Bar
        label: "Income",
        data: derived.monthlyIncome,
        borderColor: "#00e676",
        backgroundColor: "rgba(0, 230, 118, 0.1)",
        fill: true,
        tension: 0.4,
        order: 1 // Controls Z-index
      },
      {
        type: "bar",
        label: "Expense",
        data: derived.monthlyExpense,
        backgroundColor: "#ff6b6b",
        borderRadius: 5,
        order: 2
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { color: '#9fb0d6', callback: (v) => `₹${v}` }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: '#9fb0d6' }, grid: { display: false } }
    },
    plugins: {
        legend: { position: 'top', labels: { color: '#fff', boxWidth: 10, font: { size: 12 } } }
    }
  };

  return (
    <ChartWrap>
      <HeaderSection>
        <div className="title">
          <h2>Analytics</h2>
          <p>Monthly Summary for {selectedYear}</p>
        </div>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </HeaderSection>

      <MainGrid>
        <ChartArea>
          <Chart type="bar" data={mixedMonthlyData} options={options} />
        </ChartArea>

        <SideStats>
          <StatCard $color="#00e676">
            <span className="label">Income</span>
            <span className="value">₹{derived.totalIncomeYear.toLocaleString()}</span>
          </StatCard>
          <StatCard $color="#ff6b6b">
            <span className="label">Expense</span>
            <span className="value">₹{derived.totalExpenseYear.toLocaleString()}</span>
          </StatCard>
          <StatCard $color="#2979ff">
            <span className="label">Balance</span>
            <span className="value">₹{derived.totalSavingsYear.toLocaleString()}</span>
          </StatCard>
        </SideStats>
      </MainGrid>

      <FeedbackArea>
        {derived.monthlyWarning && (
          <WarnBox $danger={true}>
            ⚠️ {derived.monthlyWarning.month} expenses are up {derived.monthlyWarning.pct}% vs {derived.monthlyWarning.prevMonth}.
          </WarnBox>
        )}
        {derived.overspentMonths.length > 0 && (
          <WarnBox $danger={true}>
            💸 Overspent in: {derived.overspentMonths.join(", ")}
          </WarnBox>
        )}
        {!derived.monthlyWarning && derived.overspentMonths.length === 0 && (
          <WarnBox $danger={false}>✅ Spending is under control.</WarnBox>
        )}
      </FeedbackArea>
    </ChartWrap>
  );
}