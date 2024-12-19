const mongoose = require('mongoose');

const expenseGoalSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  goalAmount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('ExpenseGoal', expenseGoalSchema);