import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Bar } from "react-chartjs-2"; // ✅ FIXED
import { useGlobalContext } from "../context/globalContext";



function AnalyticsChart() {
  const { incomes = [], expenses = [] } = useGlobalContext();

  const parseDate = (d) => {
    if (!d) return new Date("");
    if (d instanceof Date) return d;
    if (typeof d === "string" && /^\d{1,2}-\d{1,2}-\d{4}$/.test(d.trim())) {
      const [dd, mm, yyyy] = d.trim().split("-").map(Number);
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

    const overspentMonths = months.filter((_, i) => monthlyExpense[i] > monthlyIncome[i]);

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

      if (lastExp > prevExp && prevExp > 0) {
        const pct = ((lastExp - prevExp) / prevExp) * 100;
        monthlyWarning = {
          month: months[lastMonthIndex],
          prevMonth: months[lastMonthIndex - 1],
          pct: pct.toFixed(1)
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
      monthlyWarning
    };
  }, [incomes, expenses, selectedYear]);

  const data = {
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
      },
      {
        type: "bar",
        label: "Expense",
        data: derived.monthlyExpense,
        backgroundColor: "#ff6b6b",
        borderRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#9fb0d6",
          callback: (v) => `₹${v}`
        },
        grid: { color: "rgba(255,255,255,0.05)" }
      },
      x: {
        ticks: { color: "#9fb0d6" },
        grid: { display: false }
      }
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          boxWidth: 10
        }
      }
    }
  };

  return (
    <ChartWrap>
      <HeaderSection>
        <div>
          <h2>Analytics</h2>
          <p>Monthly Summary for {selectedYear}</p>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </HeaderSection>

      <MainGrid>
        <ChartArea>
          {/* ✅ FIXED COMPONENT */}
          <Bar data={data} options={options} />
        </ChartArea>

        <SideStats>
          <StatCard $color="#00e676">
            <span>Income</span>
            <strong>₹{derived.totalIncomeYear.toLocaleString()}</strong>
          </StatCard>

          <StatCard $color="#ff6b6b">
            <span>Expense</span>
            <strong>₹{derived.totalExpenseYear.toLocaleString()}</strong>
          </StatCard>

          <StatCard $color="#2979ff">
            <span>Balance</span>
            <strong>₹{derived.totalSavingsYear.toLocaleString()}</strong>
          </StatCard>
        </SideStats>
      </MainGrid>

      <FeedbackArea>
        {derived.monthlyWarning && (
          <WarnBox $danger>
            ⚠ {derived.monthlyWarning.month} expenses up {derived.monthlyWarning.pct}% vs {derived.monthlyWarning.prevMonth}
          </WarnBox>
        )}

        {derived.overspentMonths.length > 0 && (
          <WarnBox $danger>
            💸 Overspent: {derived.overspentMonths.join(", ")}
          </WarnBox>
        )}

        {!derived.monthlyWarning && derived.overspentMonths.length === 0 && (
          <WarnBox>
            ✅ Spending is under control
          </WarnBox>
        )}
      </FeedbackArea>
    </ChartWrap>
  );
}

/* STYLES */

const ChartWrap = styled.div`
  background: #212431;
  padding: 1rem;
  border-radius: 20px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: white;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
`;

const ChartArea = styled.div`
  height: 300px;
`;

const SideStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatCard = styled.div`
  background: #2a2e3f;
  padding: 1rem;
  border-left: 4px solid ${(p) => p.$color};
  color: white;
`;

const FeedbackArea = styled.div`
  margin-top: 1rem;
`;

const WarnBox = styled.div`
  background: ${(p) =>
    p.$danger ? "rgba(255,0,0,0.1)" : "rgba(0,255,0,0.1)"};
  padding: 0.5rem;
  border-radius: 5px;
  color: white;
`;

export default AnalyticsChart;