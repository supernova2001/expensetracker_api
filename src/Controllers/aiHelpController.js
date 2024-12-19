const { analyzeMonthlyFinances } = require('../services/langChainService');

// In your controller function
async function analyzeQuery(req, res) {
    try {
      const { expenseData,goalData } = req.body;
      const result = await analyzeMonthlyFinances(expenseData, goalData);
  
      res.json({ result });
      console.log(res);
    } catch (error) {
      console.error('Error processing query:', error);
      res.status(500).json({ error: 'An error occurred while processing your query.' });
    }
  };
  
  module.exports = analyzeQuery;
