import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Chart } from 'react-chartjs-2'; // Added this
import { useGlobalContext } from "../context/globalContext"; // Added this (adjust path if needed)
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
  LineController,
  BarController 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
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
        type: "line",
        label: "Income",
        data: derived.monthlyIncome,
        borderColor: "#00e676",
        backgroundColor: "rgba(0, 230, 118, 0.1)",
        fill: true,
        tension: 0.4,
        order: 1
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

// Styled Components
const ChartWrap = styled.div`
    background: #212431;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
`;

const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    h2 { color: #fff; }
    p { color: #9fb0d6; font-size: 0.9rem; }
    select {
        background: #2a2e3f;
        color: #fff;
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #444;
    }
`;

const MainGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    height: 350px;
    @media (max-width: 768px) { grid-template-columns: 1fr; height: auto; }
`;

const ChartArea = styled.div` background: rgba(0,0,0,0.2); border-radius: 10px; padding: 1rem; `;

const SideStats = styled.div` display: flex; flex-direction: column; gap: 0.8rem; `;

const StatCard = styled.div`
    background: #2a2e3f;
    padding: 1rem;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    border-left: 5px solid ${props => props.$color};
    .label { font-size: 0.8rem; color: #9fb0d6; }
    .value { font-size: 1.2rem; font-weight: 700; color: #fff; }
`;

const FeedbackArea = styled.div` margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; `;

const WarnBox = styled.div`
    background: ${props => props.$danger ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 230, 118, 0.1)'};
    color: ${props => props.$danger ? '#ff6b6b' : '#00e676'};
    padding: 0.8rem;
    border-radius: 10px;
    font-size: 0.9rem;
`;

export default AnalyticsChart;