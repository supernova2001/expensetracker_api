const langchainService = require('../services/langChainService');
const Expense = require('../Models/Expenses.js');

async function addExpense(req, res) {
  try {
    const filePath = req.file.path;
    const userEmail = req.body.userEmail;
    const expenseDetails = await langchainService.extractExpenseDetails(filePath);
    const newExpenseData = {
        ...expenseDetails,
        userEmail: userEmail
      };
    const newExpense = Expense(newExpenseData);
    await newExpense.save();

    console.log("Added Successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = addExpense;