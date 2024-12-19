const nodemailer = require('nodemailer');
const ExpenseGoal = require('../Models/ExpenseGoal');
const Expense = require('../Models/Expenses');

// Save expense goal
async function saveExpenseGoal (req, res)  {
  try {
    const { userEmail, goalAmount, month, year } = req.body;
    const expenseGoal = new ExpenseGoal({
      userEmail,
      month,
      year,
      goalAmount
    });

    console.log(expenseGoal);
    await expenseGoal.save();
    res.status(200).json({ message: 'Expense goal set successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to set expense goal' });
  }
};

// Function to check expense goal and send email alert
async function checkExpenseGoalAndAlert (userEmail) {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
      const currentYear = currentDate.getFullYear();
  
      // Get the expense goal for current month
      const goal = await ExpenseGoal.findOne({
        userEmail,
        month: currentMonth,
        year: currentYear
      });
  
      if (!goal) return;
  
      // Calculate total expenses for current month
      const expenses = await Expense.find({
        userEmail,
        date: {
          $gte: new Date(currentYear, currentDate.getMonth(), 1),
          $lte: new Date(currentYear, currentDate.getMonth() + 1, 0)
        }
      });
  
      const totalExpenses = expenses.reduce((total, expense) => 
        total + parseFloat(expense.totalAmount.replace(/[^0-9.-]+/g, "")), 0);
  
      // Send alert if expenses exceed goal
      if (totalExpenses > goal.goalAmount) {
        const transporter = nodemailer.createTransport({
          // Configure your email service
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
  
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: 'Expense Goal Alert',
          text: `Your expenses for ${currentMonth} ${currentYear} (${totalExpenses}) have exceeded your goal of ${goal.goalAmount}`
        };
  
        await transporter.sendMail(mailOptions);
      }
    } catch (error) {
      console.error('Error checking expense goal:', error);
    }
};
  

module.exports = {saveExpenseGoal,checkExpenseGoalAndAlert};
