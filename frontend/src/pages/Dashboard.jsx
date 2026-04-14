import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch user-specific expenses once logged in
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const { data } = await axios.get(`${backendUrl}/api/transactions/get-expenses`, {
          headers: { token },
        });

        if (data.success) {
          setExpenses(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [token]);

  const handleLogout = () => {
    logout();
    toast.info("You’ve been logged out");
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Welcome to your Expense Tracker</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading your expenses...</p>
      ) : expenses.length === 0 ? (
        <p>No expenses found. Add some!</p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <p>{expense.title}</p>
              <p className="font-semibold text-gray-700">${expense.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
