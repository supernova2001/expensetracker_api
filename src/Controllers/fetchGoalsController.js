const express = require('express');
const ExpenseGoal = require('../Models/ExpenseGoal.js');

async function fetchGoals (req, res){
    try {
        const { Email } = req.query;
        if (!Email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const goals = await ExpenseGoal.find({ userEmail: Email });  // Find expenses by email
        res.json({ goals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = fetchGoals;
