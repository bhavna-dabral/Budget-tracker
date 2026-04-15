import React, { useContext, useState, useCallback, useMemo } from "react";
import axios from "axios";

/* ---------------- SAFE BASE URL ---------------- */

const BASE_URL =
  (process.env.REACT_APP_BACKEND_URL
    ? process.env.REACT_APP_BACKEND_URL.replace(/\/$/, "")
    : "http://localhost:5000") + "/api/v1";

/* ---------------- CONTEXT ---------------- */

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  /* ---------------- AXIOS INSTANCE ---------------- */

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    );

    return instance;
  }, []);

  /* ---------------- INCOMES ---------------- */

  const getIncomes = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/get-incomes");
      setIncomes(Array.isArray(data) ? data : data?.incomes || []);
    } catch (err) {
      setError("Error fetching incomes");
      setIncomes([]);
    }
  }, [axiosInstance]);

  const addIncome = async (income) => {
    try {
      await axiosInstance.post("/add-income", {
        ...income,
        amount: Number(income.amount),
        date: new Date(income.date).toISOString(),
      });

      await getIncomes();
    } catch {
      setError("Error adding income");
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(`/delete-income/${id}`);
      await getIncomes();
    } catch {
      setError("Error deleting income");
    }
  };

  /* ---------------- EXPENSES ---------------- */

  const getExpenses = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/get-expenses");
      setExpenses(Array.isArray(data) ? data : data?.expenses || []);
    } catch {
      setError("Error fetching expenses");
      setExpenses([]);
    }
  }, [axiosInstance]);

  const addExpense = async (expense) => {
    try {
      await axiosInstance.post("/add-expense", {
        ...expense,
        amount: Number(expense.amount),
        date: new Date(expense.date).toISOString(),
      });

      await getExpenses();
    } catch {
      setError("Error adding expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(`/delete-expense/${id}`);
      await getExpenses();
    } catch {
      setError("Error deleting expense");
    }
  };

  /* ---------------- SAFE CALCULATIONS ---------------- */

  const totalIncome = () =>
    incomes.reduce((a, b) => a + Number(b.amount || 0), 0);

  const totalExpenses = () =>
    expenses.reduce((a, b) => a + Number(b.amount || 0), 0);

  const totalBalance = () => totalIncome() - totalExpenses();

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];

    return history
      .filter((t) => t && t.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  };

  /* ---------------- PROVIDER ---------------- */

  return (
    <GlobalContext.Provider
      value={{
        incomes,
        addIncome,
        getIncomes,
        deleteIncome,
        expenses,
        addExpense,
        getExpenses,
        deleteExpense,
        totalIncome,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);git add .