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
  Filler, // Required to fix the "Filler" warning in your console
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useGlobalContext } from "../../context/globalContext";

// Register all necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

function Chart() {
  const { incomes = [], expenses = [] } = useGlobalContext();

  // Helper to parse different date formats
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
      if (!isNaN(dt)) years.add(dt.getFullYear());
    });
    if (years.size === 0) years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [incomes, expenses]);

  const [selectedYear, setSelectedYear] = useState(
    availableYears.length ? availableYears[0] : new Date().getFullYear()
  );

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const monthlySums = (items, year) => {
    const arr = Array(12).fill(0);
    items.forEach((it) => {
      const dt = parseDate(it.date);
      if (!isNaN(dt) && dt.getFullYear() === year) {
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
    const allIncome = incomes.reduce((s, it) => s + Number(it.amount || 0), 0);
    const allExpense = expenses.reduce((s, it) => s + Number(it.amount || 0), 0);
    const walletAllTime = allIncome - allExpense;

    // Overspent check
    const overspentMonths = months.filter((m, i) => monthlyExpense[i] > monthlyIncome[i]);

    // Monthly Warning Logic
    let lastMonthIndex = -1;
    for (let i = 11; i >= 0; i--) {
      if (monthlyIncome[i] + monthlyExpense[i] > 0) { lastMonthIndex = i; break; }
    }
    let monthlyWarning = null;
    if (lastMonthIndex > 0) {
      const lastExp = monthlyExpense[lastMonthIndex];
      const prevExp = monthlyExpense[lastMonthIndex - 1];
      if (lastExp > prevExp) {
        const pct = prevExp === 0 ? 100 : ((lastExp - prevExp) / prevExp) * 100;
        monthlyWarning = { month: months[lastMonthIndex], prevMonth: months[lastMonthIndex - 1], pct: pct.toFixed(1) };
      }
    }

    return { monthlyIncome, monthlyExpense, totalIncomeYear, totalExpenseYear, totalSavingsYear, walletAllTime, overspentMonths, monthlyWarning };
  }, [incomes, expenses, selectedYear]);

  const mixedMonthlyData = {
    labels: months,
    datasets: [
      {
        type: "bar",
        label: "Expense",
        data: derived.monthlyExpense,
        backgroundColor: "#ff6b6b",
        borderRadius: 5,
      },
      {
        type: "line",
        label: "Income",
        data: derived.monthlyIncome,
        borderColor: "#00e676",
        backgroundColor: "rgba(0, 230, 118, 0.1)",
        fill: true, // Now works because Filler is registered
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => `₹${v}` } },
    },
    plugins: {
        legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10 } } }
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
          <Bar data={mixedMonthlyData} options={options} />
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
        {!derived.monthlyWarning && <WarnBox $danger={false}>✅ Spending is under control.</WarnBox>}
      </FeedbackArea>
    </ChartWrap>
  );
}

// --- RESPONSIVE STYLES ---
const ChartWrap = styled.div`
  background: #0b1726;
  color: #fff;
  padding: 1.5rem;
  border-radius: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  select { background: #1a2f45; color: white; border: none; padding: 5px 10px; border-radius: 5px; }
  h2 { margin: 0; font-size: 1.5rem; }
  p { margin: 0; font-size: 0.8rem; color: #9fb0d6; }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 3fr 1fr;
  }
`;

const ChartArea = styled.div`
  position: relative;
  height: 300px;
  width: 100%;
  background: rgba(255,255,255,0.03);
  border-radius: 15px;
  padding: 10px;
`;

const SideStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
  }
`;

const StatCard = styled.div`
  background: rgba(255,255,255,0.05);
  padding: 1rem;
  border-radius: 12px;
  border-left: 5px solid ${props => props.$color};
  display: flex;
  flex-direction: column;
  .label { font-size: 0.7rem; color: #9fb0d6; text-transform: uppercase; }
  .value { font-size: 1.1rem; font-weight: bold; }
`;

const FeedbackArea = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WarnBox = styled.div`
  background: ${p => p.$danger ? "rgba(255, 107, 107, 0.1)" : "rgba(0, 230, 118, 0.1)"};
  color: ${p => p.$danger ? "#ffb3b3" : "#b9ffd9"};
  padding: 12px;
  border-radius: 10px;
  font-size: 0.9rem;
  border: 1px solid ${p => p.$danger ? "rgba(255, 107, 107, 0.2)" : "rgba(0, 230, 118, 0.2)"};
`;

export default Chart;