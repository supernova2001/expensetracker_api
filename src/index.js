const express = require('express');
const connectDB = require('../src/db.js');
const loginController = require('./Controllers/LoginController.js');
const routes = require('./routes.js');
const cors = require("cors");

const app = express();

app.use(cors());

app.options("*", cors());

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));