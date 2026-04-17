import { useMemo } from "react";

/* ---------------- SAFE DATE ---------------- */
const parseDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  return isNaN(date.getTime()) ? null : date;
};

export const useAnalytics = (incomes = [], expenses = []) => {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return useMemo(() => {
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    /* ---------------- MONTHLY DATA ---------------- */
    incomes.forEach(item => {
      const dt = parseDate(item.date);
      if (dt) {
        monthlyIncome[dt.getMonth()] += Number(item.amount || 0);
      }
    });

    expenses.forEach(item => {
      const dt = parseDate(item.date);
      if (dt) {
        monthlyExpense[dt.getMonth()] += Number(item.amount || 0);
      }
    });

    const totalIncome = monthlyIncome.reduce((a,b)=>a+b,0);
    const totalExpense = monthlyExpense.reduce((a,b)=>a+b,0);

    /* ---------------- FIND LAST ACTIVE MONTH ---------------- */
    let lastMonthIndex = -1;
    for (let i = 11; i >= 0; i--) {
      if (monthlyIncome[i] > 0 || monthlyExpense[i] > 0) {
        lastMonthIndex = i;
        break;
      }
    }

    /* ---------------- MONTHLY WARNING (FIXED) ---------------- */
    let monthlyWarning = null;

    if (lastMonthIndex > 0) {
      const current = monthlyExpense[lastMonthIndex];
      const previous = monthlyExpense[lastMonthIndex - 1];

      if (previous > 0 && current > previous) {
        const pct = ((current - previous) / previous) * 100;
        monthlyWarning = {
          month: months[lastMonthIndex],
          pct: pct.toFixed(1)
        };
      }
    }

    /* ---------------- OVESPENT ---------------- */
    const overspentMonths = months.filter(
      (_, i) => monthlyExpense[i] > monthlyIncome[i]
    );

    /* ---------------- YEARLY DATA ---------------- */
    const yearlyMap = {};

    incomes.forEach(item => {
      const dt = parseDate(item.date);
      if (!dt) return;

      const year = dt.getFullYear();
      if (!yearlyMap[year]) {
        yearlyMap[year] = { year, income: 0, expense: 0 };
      }

      yearlyMap[year].income += Number(item.amount || 0);
    });

    expenses.forEach(item => {
      const dt = parseDate(item.date);
      if (!dt) return;

      const year = dt.getFullYear();
      if (!yearlyMap[year]) {
        yearlyMap[year] = { year, income: 0, expense: 0 };
      }

      yearlyMap[year].expense += Number(item.amount || 0);
    });

    const yearlyData = Object.values(yearlyMap).sort(
      (a,b)=>a.year-b.year
    );

    /* ---------------- YEARLY CHANGE ---------------- */
    let yearlyChange = null;

    if (yearlyData.length > 1) {
      const last = yearlyData.at(-1).expense;
      const prev = yearlyData.at(-2).expense;

      if (prev > 0) {
        yearlyChange = ((last - prev) / prev * 100).toFixed(1);
      }
    }

    /* ---------------- BUDGET ---------------- */
    const budget = 50000;
    const budgetUsed = budget > 0
      ? (totalExpense / budget) * 100
      : 0;

    /* ---------------- PREDICTION (IMPROVED) ---------------- */
    const recentExpenses = monthlyExpense
      .filter(v => v > 0)
      .slice(-3);

    const prediction = recentExpenses.length
      ? recentExpenses.reduce((a,b)=>a+b,0) / recentExpenses.length
      : 0;

    /* ---------------- AI INSIGHTS (UPGRADED) ---------------- */
    const categoryMap = {};

    expenses.forEach(item => {
      const category = item.category || "other";
      categoryMap[category] =
        (categoryMap[category] || 0) + Number(item.amount || 0);
    });

    const topCategory = Object.entries(categoryMap)
      .sort((a,b)=>b[1]-a[1])[0];

    const insights = [];

    if (topCategory) {
      insights.push(`You spend most on ${topCategory[0]}`);
    }

    if (overspentMonths.length > 0) {
      insights.push(`Overspent in ${overspentMonths.join(", ")}`);
    }

    if (overspentMonths.length >= 3) {
      insights.push("You are overspending frequently");
    }

    if (totalIncome > totalExpense) {
      insights.push("Good job! You are saving money");
    } else if (totalExpense > totalIncome) {
      insights.push("Expenses exceed income");
    }

    if (monthlyWarning) {
      insights.push(`Spending increased in ${monthlyWarning.month}`);
    }

    /* ---------------- FINAL RETURN ---------------- */
    return {
      months,
      monthlyIncome,
      monthlyExpense,
      totalIncome,
      totalExpense,
      monthlyWarning,
      overspentMonths,
      yearlyData,
      yearlyChange,
      budget,
      budgetUsed,
      prediction,
      insights
    };

  }, [incomes, expenses]);
};