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

/* --- Helpers moved OUTSIDE to satisfy ESLint --- */

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const parseDate = (d) => {
  if (!d) return new Date("");
  if (d instanceof Date) return d;
  if (typeof d === "string" && /^\d{1,2}-\d{1,2}-\d{4}$/.test(d.trim())) {
    const [dd, mm, yyyy] = d.trim().split("-").map((s) => Number(s));
    return new Date(yyyy, mm - 1, dd);
  }
  return new Date(d);
};

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

/* --- Component --- */

function Chart() {
  const { incomes = [], expenses = [] } = useGlobalContext();

  // derive available years
  const availableYears = useMemo(() => {
    const years = new Set();
    incomes.forEach((it) => {
      const dt = parseDate(it.date);
      if (!isNaN(dt)) years.add(dt.getFullYear());
    });
    expenses.forEach((it) => {
      const dt = parseDate(it.date);
      if (!isNaN(dt)) years.add(dt.getFullYear());
    });
    if (years.size === 0) years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [incomes, expenses]);

  const [selectedYear, setSelectedYear] = useState(
    availableYears.length ? availableYears[0] : new Date().getFullYear()
  );

  useEffect(() => {
    if (availableYears.length && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Build all derived metrics
  const derived = useMemo(() => {
    const monthlyIncome = monthlySums(incomes, selectedYear);
    const monthlyExpense = monthlySums(expenses, selectedYear);

    const totalIncomeYear = monthlyIncome.reduce((s, v) => s + v, 0);
    const totalExpenseYear = monthlyExpense.reduce((s, v) => s + v, 0);
    const totalSavingsYear = totalIncomeYear - totalExpenseYear;

    const allIncome = incomes.reduce((s, it) => s + Number(it.amount || 0), 0);
    const allExpense = expenses.reduce((s, it) => s + Number(it.amount || 0), 0);
    const walletAllTime = allIncome - allExpense;

    const overspentMonths = months.filter((m, i) => monthlyExpense[i] > monthlyIncome[i]);

    let lastMonthIndex = -1;
    for (let i = 11; i >= 0; i--) {
      if (monthlyIncome[i] + monthlyExpense[i] > 0) { lastMonthIndex = i; break; }
    }

    let monthlyWarning = null;
    if (lastMonthIndex > 0) {
      const lastExp = monthlyExpense[lastMonthIndex];
      const prevExp = monthlyExpense[lastMonthIndex - 1];
      if (lastExp > prevExp) {
        const pct = prevExp === 0 ? 100 : ((lastExp - prevExp) / (prevExp || 1)) * 100;
        monthlyWarning = {
          month: months[lastMonthIndex],
          prevMonth: months[lastMonthIndex - 1],
          lastExp,
          prevExp,
          pct: Number(pct.toFixed(1)),
        };
      }
    }

    const allYearsAsc = Array.from(new Set([
      ...incomes.map(i => parseDate(i.date).getFullYear()).filter(y => !isNaN(y)),
      ...expenses.map(e => parseDate(e.date).getFullYear()).filter(y => !isNaN(y)),
    ])).sort((a,b) => a - b);
    if (allYearsAsc.length === 0) allYearsAsc.push(new Date().getFullYear());

    const yearlyIncomeTotals = allYearsAsc.map((y) =>
      incomes.reduce((s, it) => {
        const dt = parseDate(it.date);
        return s + ((isNaN(dt) || dt.getFullYear() !== y) ? 0 : Number(it.amount || 0));
      }, 0)
    );

    const yearlyExpenseTotals = allYearsAsc.map((y) =>
      expenses.reduce((s, it) => {
        const dt = parseDate(it.date);
        return s + ((isNaN(dt) || dt.getFullYear() !== y) ? 0 : Number(it.amount || 0));
      }, 0)
    );

    let yearlyWarning = null;
    const idxSel = allYearsAsc.indexOf(selectedYear);
    if (idxSel > 0) {
      const selExp = yearlyExpenseTotals[idxSel];
      const prevExp = yearlyExpenseTotals[idxSel - 1];
      if (selExp > prevExp) {
        const pct = prevExp === 0 ? 100 : ((selExp - prevExp) / (prevExp || 1)) * 100;
        yearlyWarning = {
          year: selectedYear,
          prevYear: allYearsAsc[idxSel - 1],
          selExp,
          prevExp,
          pct: Number(pct.toFixed(1)),
        };
      }
    }

    return {
      monthlyIncome,
      monthlyExpense,
      totalIncomeYear,
      totalExpenseYear,
      totalSavingsYear,
      walletAllTime,
      overspentMonths,
      lastMonthIndex,
      monthlyWarning,
      yearlyWarning,
      allYearsAsc,
      yearlyIncomeTotals,
      yearlyExpenseTotals,
    };
  }, [incomes, expenses, selectedYear]);

  const mixedMonthlyData = useMemo(() => {
    return {
      labels: months,
      datasets: [
        {
          type: "bar",
          label: "Expense",
          data: derived.monthlyExpense,
          backgroundColor: "#ff6b6b",
          borderRadius: 6,
          order: 2,
        },
        {
          type: "line",
          label: "Income",
          data: derived.monthlyIncome,
          borderColor: "#00e676",
          backgroundColor: "rgba(0,230,118,0.08)",
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 4,
          order: 1,
          fill: true,
        },
      ],
    };
  }, [derived.monthlyIncome, derived.monthlyExpense]);

  const yearlyComparisonData = useMemo(() => {
    return {
      labels: derived.allYearsAsc.map(String),
      datasets: [
        {
          label: "Income",
          data: derived.yearlyIncomeTotals,
          backgroundColor: "#00e676",
        },
        {
          label: "Expense",
          data: derived.yearlyExpenseTotals,
          backgroundColor: "#ff6b6b",
        },
      ],
    };
  }, [derived.allYearsAsc, derived.yearlyIncomeTotals, derived.yearlyExpenseTotals]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => `₹${v}` },
      },
    },
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString()}`;
  const savingsPct = derived.totalIncomeYear > 0
    ? (((derived.totalIncomeYear - derived.totalExpenseYear) / derived.totalIncomeYear) * 100).toFixed(1)
    : "0.0";

  return (
    <Wrap>
      <TopRow>
        <Title>
          <h2>Analytics</h2>
          <p className="muted">Monthly breakdown (Income = line, Expense = bars)</p>
        </Title>

        <YearSelect>
          <label className="sr">Choose year</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </YearSelect>
      </TopRow>

      <MainGrid>
        <ChartArea>
          <Bar data={mixedMonthlyData} options={chartOptions} />
        </ChartArea>

        <RightPanel>
          <StatCard color="#00e676">
            <div className="label">Total Income</div>
            <div className="value">{fmt(derived.totalIncomeYear)}</div>
          </StatCard>
          <StatCard color="#ff6b6b">
            <div className="label">Total Expense</div>
            <div className="value">{fmt(derived.totalExpenseYear)}</div>
          </StatCard>
          <StatCard color="#2979ff">
            <div className="label">Savings</div>
            <div className="value">{fmt(derived.totalSavingsYear)}</div>
            <div className="small muted">Savings rate: <strong>{savingsPct}%</strong></div>
          </StatCard>
          <StatCard color="#f59e0b">
            <div className="label">Wallet (All-time)</div>
            <div className="value">{fmt(derived.walletAllTime)}</div>
            <div className="small muted">All-time balance</div>
          </StatCard>
        </RightPanel>
      </MainGrid>

      <WarningsRow>
        {derived.monthlyWarning ? (
          <WarnBox danger>
            <strong>Monthly Warning:</strong> Expense in {derived.monthlyWarning.month} (₹{derived.monthlyExpense[derived.lastMonthIndex]}) is higher than {derived.monthlyWarning.prevMonth} (₹{derived.monthlyWarning.prevExp}) — up {derived.monthlyWarning.pct}%.
          </WarnBox>
        ) : (
          <OkBox>✅ Monthly expenses are stable or lower than previous month.</OkBox>
        )}

        {derived.yearlyWarning ? (
          <WarnBox danger>
            <strong>Yearly Warning:</strong> Expenses in {derived.yearlyWarning.year} (₹{derived.yearlyWarning.selExp}) are higher than {derived.yearlyWarning.prevYear} (₹{derived.yearlyWarning.prevExp}) — up {derived.yearlyWarning.pct}%.
          </WarnBox>
        ) : (
          <OkBox>✅ Yearly expenses did not increase over previous year.</OkBox>
        )}
      </WarningsRow>

      <Overspent>
        {derived.overspentMonths.length > 0 ? (
          <div>
            ⚠ Overspent months in {selectedYear}: <strong>{derived.overspentMonths.join(", ")}</strong>
          </div>
        ) : (
          <div>✅ No months where expense &gt; income in {selectedYear}.</div>
        )}
      </Overspent>

      <ComparisonSection>
        <h4>Year-to-Year Comparison</h4>
        <div className="comparison-grid">
          <div className="comp-chart">
            <Bar data={yearlyComparisonData} options={{...chartOptions, maintainAspectRatio:false}} />
          </div>
          <div className="comp-insights">
            <p><strong>Best saving year:</strong>{" "}
              {(() => {
                const savings = derived.yearlyIncomeTotals.map((v,i) => v - derived.yearlyExpenseTotals[i]);
                const max = Math.max(...savings);
                const idx = savings.indexOf(max);
                return derived.allYearsAsc[idx] ?? "N/A";
              })()}
            </p>
            <p><strong>Highest spending year:</strong>{" "}
              {(() => {
                const max = Math.max(...derived.yearlyExpenseTotals);
                const idx = derived.yearlyExpenseTotals.indexOf(max);
                return derived.allYearsAsc[idx] ?? "N/A";
              })()}
            </p>
          </div>
        </div>
      </ComparisonSection>
    </Wrap>
  );
}

/* ---------------- Styles ---------------- */
const Wrap = styled.div`
  background: linear-gradient(180deg,#071024 0%, #0b1726 100%);
  color: #e6f0ff;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(2,8,23,0.6);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
`;

const TopRow = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  margin-bottom:12px;
  .muted { color: #9fb0d6; font-size:0.92rem; }
`;

const Title = styled.div`
  h2 { margin: 0; }
  p { margin:6px 0 0 0; color: #9fb0d6; font-size:0.95rem; }
`;

const YearSelect = styled.div`
  select {
    background:#081229;
    color: #e6f0ff;
    border: 1px solid rgba(255,255,255,0.04);
    padding:8px 10px;
    border-radius:8px;
    outline:none;
  }
`;

const MainGrid = styled.div`
  display:grid;
  grid-template-columns: 1fr 280px;
  gap: 18px;
  align-items:start;
  @media (max-width:880px) { grid-template-columns: 1fr 220px; }
  @media (max-width:720px) { grid-template-columns: 1fr; }
`;

const ChartArea = styled.div`
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding:12px;
  border-radius:10px;
  min-height: 340px;
`;

const RightPanel = styled.aside`
  display:flex;
  flex-direction:column;
  gap:10px;
  @media (max-width:720px) {
    flex-direction:row;
    overflow-x:auto;
    padding-bottom:8px;
    & > * { min-width:160px; flex:0 0 160px; }
  }
`;

const StatCard = styled.div`
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding:12px;
  border-radius:10px;
  border-left:4px solid ${(p) => p.color || "#888"};
  .label { color:#9fb0d6; font-size:0.85rem; }
  .value { font-weight:700; font-size:1.05rem; margin-top:4px; }
  .small.muted { color:#9fb0d6; font-size:0.82rem; margin-top:6px; }
`;

const WarningsRow = styled.div`
  margin-top:12px;
  display:flex;
  gap:12px;
  flex-wrap:wrap;
`;

const WarnBox = styled.div`
  background: ${(p) => (p.danger ? "rgba(255,107,107,0.08)" : "rgba(0,230,150,0.06)")};
  color: ${(p) => (p.danger ? "#ffb3b3" : "#b9ffd9")};
  border-left: 4px solid ${(p) => (p.danger ? "#ff6b6b" : "#00e676")};
  padding: 10px;
  border-radius: 8px;
  font-weight:600;
`;

const OkBox = styled(WarnBox)``;

const Overspent = styled.div`
  margin-top:12px;
  padding: 10px;
  color: #ffd8a8;
  background: rgba(255,215,138,0.03);
  border-left: 4px solid #f59e0b;
  border-radius:8px;
`;

const ComparisonSection = styled.section`
  margin-top:16px;
  h4 { margin:0 0 8px 0; color:#dbeafe; }
  .comparison-grid {
    display:flex;
    gap:12px;
    align-items:flex-start;
    .comp-chart { flex:1; min-height:150px; background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent); padding:8px; border-radius:10px; }
    .comp-insights { width:240px; background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent); padding:10px; border-radius:10px; }
  }
  @media (max-width:720px) {
    .comparison-grid { flex-direction:column; }
    .comp-insights { width:100%; }
  }
`;

export default Chart;