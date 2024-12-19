const Expense = require('../Models/Expenses.js');
const { checkExpenseGoalAndAlert } = require('./expenseGoalController.js');

async function ManualExpenseAddition (req, res) {
    try {
      const {userEmail,companyName,date,totalAmount,modeOfPayment} = req.body;
      const newExpenseData = {
        companyName: companyName,
        totalAmount: totalAmount,
        date:date,
        modeOfPayment: modeOfPayment,
        userEmail: userEmail
      };
      const newExpense = Expense(newExpenseData);
      await newExpense.save();

      console.log("Added Successfully");
        
      await checkExpenseGoalAndAlert(userEmail);
      
      res.status(200).json({ message: 'Expense added successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add expense' });
    }
  };

  module.exports = ManualExpenseAddition;
  