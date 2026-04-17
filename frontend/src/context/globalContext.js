import React, { useContext, useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";

const GlobalContext = React.createContext();

const BASE_URL =
  (process.env.REACT_APP_BACKEND_URL
    ? process.env.REACT_APP_BACKEND_URL.replace(/\/$/, "")
    : "http://localhost:5000") + "/api";

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ⭐ NEW

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
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(err);
      }
    );

    return instance;
  }, []);

  /* ---------------- API CALLS ---------------- */

  const getIncomes = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/v1/get-incomes");
      setIncomes(Array.isArray(data) ? data : data?.incomes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching incomes");
    }
  }, [axiosInstance]);

  const addIncome = async (income) => {
    try {
      await axiosInstance.post("/v1/add-income", {
        ...income,
        amount: Number(income.amount),
        date: new Date(income.date).toISOString(),
      });
      await getIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding income");
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(`/v1/delete-income/${id}`);
      await getIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting income");
    }
  };

  const getExpenses = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/v1/get-expenses");
      setExpenses(Array.isArray(data) ? data : data?.expenses || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching expenses");
    }
  }, [axiosInstance]);

  const addExpense = async (expense) => {
    try {
      await axiosInstance.post("/v1/add-expense", {
        ...expense,
        amount: Number(expense.amount),
        date: new Date(expense.date).toISOString(),
      });
      await getExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(`/v1/delete-expense/${id}`);
      await getExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting expense");
    }
  };

  /* ---------------- AUTO FETCH (FIX FOR 0 VALUES) ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getIncomes(), getExpenses()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getIncomes, getExpenses]);

  /* ---------------- CALCULATIONS ---------------- */

  const totalIncome = incomes.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalBalance = totalIncome - totalExpenses;

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    return history
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  };

  /* ---------------- PROVIDER ---------------- */

  return (
    <GlobalContext.Provider
      value={{
        incomes,
        expenses,

        addIncome,
        addExpense,

        getIncomes,
        getExpenses,

        deleteIncome,
        deleteExpense,

        totalIncome,
        totalExpenses,
        totalBalance,

        transactionHistory,

        error,
        setError,

        loading, // ⭐ useful for loader
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);