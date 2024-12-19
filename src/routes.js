const express = require('express');
const router = express.Router();
const loginUser = require('./Controllers/LoginController.js');
const registerUser = require('./Controllers/RegisterController.js');
const extractInformation = require('./Controllers/extractDataController.js');
const upload = require('./middleware/upload.js');
const addExpense= require('./Controllers/saveExpensesController.js');
const fetchExpenses = require('./Controllers/fetchExpensesController.js');
const fetchGoals = require('./Controllers/fetchGoalsController.js');
const searchQuery = require('./Controllers/searchQueryController.js');
const {saveExpenseGoal} = require('./Controllers/expenseGoalController.js');
const ManualExpenseAddition = require('./Controllers/manualExpenseAddition.js');
const analyzeQuery = require('./Controllers/aiHelpController.js');

router.post('/login', loginUser);
router.post('/register',registerUser);
router.post('/uploadocument',upload.single('file'),extractInformation);
router.post('/addexpense',upload.single('file'),addExpense);
router.get('/expenses',fetchExpenses);
router.get('/goal',fetchGoals);
router.post('/ai-help',analyzeQuery);
router.post('/expense-query',searchQuery);
router.post('/set-expense-goal',saveExpenseGoal);
router.post('/addmanualexpense',ManualExpenseAddition);


module.exports = router;