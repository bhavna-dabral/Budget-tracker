import React, { useContext, useState, useCallback, useMemo } from "react";
import axios from "axios";

// 1. Ensure the URL ends with a slash to prevent joining errors
const BASE_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.endsWith('/') ? process.env.REACT_APP_API_URL : `${process.env.REACT_APP_API_URL}/`
  : "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  // 2. Wrap in useMemo so the instance doesn't change on every render
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
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

  // 💰 INCOMES
  const getIncomes = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("get-incomes");
      // Improved check: data.incomes might be undefined depending on backend structure
      const results = Array.isArray(data) ? data : (data.incomes || []);
      setIncomes(results);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching incomes");
      setIncomes([]);
    }
  }, [axiosInstance]);

  const addIncome = async (income) => {
    try {
      await axiosInstance.post("add-income", {
        ...income,
        amount: Number(income.amount),
        // Ensure it's a valid date string even if input is a string or object
        date: new Date(income.date).toISOString() 
      });
      await getIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding income");
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(`delete-income/${id}`);
      await getIncomes();
    } catch (err) {
      setError("Error deleting income");
    }
  };

  // 💸 EXPENSES
  const getExpenses = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("get-expenses");
      const results = Array.isArray(data) ? data : (data.expenses || []);
      setExpenses(results);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching expenses");
      setExpenses([]);
    }
  }, [axiosInstance]);

  const addExpense = async (expense) => {
    try {
      await axiosInstance.post("add-expense", {
        ...expense,
        amount: Number(expense.amount),
        date: new Date(expense.date).toISOString()
      });
      await getExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(`delete-expense/${id}`);
      await getExpenses();
    } catch (err) {
      setError("Error deleting expense");
    }
  };

  // CALCULATIONS
  const totalIncome = () => incomes.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalExpenses = () => expenses.reduce((acc, item) => acc + Number(item.amount), 0);
  const totalBalance = () => totalIncome() - totalExpenses();

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider value={{
      incomes, addIncome, getIncomes, deleteIncome,
      expenses, addExpense, getExpenses, deleteExpense,
      totalIncome, totalExpenses, totalBalance, transactionHistory,
      error, setError
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);