import express from "express";
import {
  addExpense,
  getExpense,
  deleteExpense,
} from "../controllers/expense.js";
import {
  addIncome,
  getIncomes,
  deleteIncome,
} from "../controllers/income.js";
import authUser from "../middleware/authUser.js"; // ✅ this matches your filename

const router = express.Router();

router.post("/add-income", authUser, addIncome);
router.get("/get-incomes", authUser, getIncomes);
router.delete("/delete-income/:id", authUser, deleteIncome);

router.post("/add-expense", authUser, addExpense);
router.get("/get-expenses", authUser, getExpense);
router.delete("/delete-expense/:id", authUser, deleteExpense);

export default router;
