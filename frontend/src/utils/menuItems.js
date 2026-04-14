import { dashboard, expenses, transactions, trend } from "../utils/Icons";

export const menuItems = [
  { id: 1, title: "Dashboard", icon: dashboard, link: "/" },
  { id: 2, title: "Incomes", icon: trend, link: "/incomes" },
  { id: 3, title: "Expenses", icon: expenses, link: "/expenses" },
  { id: 4, title: "View Transactions", icon: transactions, link: "/transactions" },
];
