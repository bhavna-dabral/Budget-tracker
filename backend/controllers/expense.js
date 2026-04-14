import Expense from "../models/ExpenseModel.js"; // better naming

// ✅ Add Expense
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;
    const userId = req.user.id; // 👈 from auth middleware

    // Validation
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number!" });
    }

    // Create expense linked to user
    const expense = await Expense.create({
      title,
      amount,
      category,
      description,
      date,
      userId, // 👈 link expense to the logged-in user
    });

    res.status(201).json({ success: true, message: "Expense added successfully", expense });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Expenses for Logged-in User
export const getExpense = async (req, res) => {
  try {
    const userId = req.user.id; // 👈 only get user’s own expenses
    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error("Get expense error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Expense by ID (and user)
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
