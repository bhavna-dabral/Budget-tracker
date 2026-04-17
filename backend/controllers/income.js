import Income from "../models/IncomeModel.js"; // ✅ use model, not schema name

// ✅ Add Income
export const addIncome = async (req, res) => {
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

    // ✅ Link to user
    const income = await Income.create({
      title,
      amount,
      category,
      description,
      date,
      userId, // 👈 this ties income to the logged-in user
    });

    res.status(201).json({ success: true, message: "Income added successfully", income });
  } catch (error) {
    console.error("Add income error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Incomes (only for logged-in user)
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      incomes
    });

  } catch (error) {
    console.error("Get incomes error:", error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Income.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });

  } catch (error) {
    console.error("Delete Income Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};