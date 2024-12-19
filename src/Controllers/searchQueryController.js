const { queryExpenseData } = require('../services/langChainService');
const Expense = require('../Models/Expenses.js');

// In your controller function
async function searchQuery(req, res) {
  try {
    const { query,user } = req.body;
    const expenses = await Expense.find({ userEmail: user });
    const result = await queryExpenseData(query, expenses);

    res.json({ result });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'An error occurred while processing your query.' });
  }
};

module.exports = searchQuery;
