const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userEmail: {type: String, required: true},
  companyName: { type: String, required: true },
  date: { type: String, required: true },
  totalAmount: { type: String, required: true },
  modeOfPayment: { type: String, required: true },
});

module.exports = mongoose.model("Expense", expenseSchema);