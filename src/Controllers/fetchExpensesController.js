const express = require('express');
const Expense = require('../Models/Expenses.js');

async function fetchExpenses (req, res){
    try {
        const { Email } = req.query;
        if (!Email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const expenses = await Expense.find({ userEmail: Email });  // Find expenses by email
        res.json({ expenses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = fetchExpenses;
