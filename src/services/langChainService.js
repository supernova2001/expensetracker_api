const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { UnstructuredLoader } = require("@langchain/community/document_loaders/fs/unstructured");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");
const { RetrievalQAChain } = require("langchain/chains");
const { model, embeddings } = require('../config/langchainConfig');

// Extracts information and returns a summary
const extractInformation = async (filePath) => {
  try {
    let loader;
    if (filePath.endsWith('.pdf')) {
      loader = new PDFLoader(filePath);
    } else if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      loader = new UnstructuredLoader(filePath, {
        apiKey: process.env.LANGCHAIN_API_KEY,
      });
    } else {
      throw new Error('Unsupported file type');
    }

    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    const vectorStore = await HNSWLib.fromDocuments(splitDocs, embeddings);
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever({ k: 5 }));

    const extractionQuery = `
      Extract the following details from the document:
      {
        "Summarize the document elaboratedly"
      }
    `;
    const extractionResponse = await chain.call({ query: extractionQuery });

    return extractionResponse.text;
  } catch (error) {
    throw new Error(`Failed to extract information: ${error.message}`);
  }
};

// Extracts specific expense details
const extractExpenseDetails = async (filePath) => {
  try {
    let loader;
    if (filePath.endsWith('.pdf')) {
      loader = new PDFLoader(filePath);
    } else if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      loader = new UnstructuredLoader(filePath, {
        apiKey: process.env.LANGCHAIN_API_KEY,
      });
    } else {
      throw new Error('Unsupported file type');
    }

    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    const vectorStore = await HNSWLib.fromDocuments(splitDocs, embeddings);
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever({ k: 5 }));

    const extractionQuery = `
      Extract the following details from the document in JSON format:
      {
        "companyName": "Company Name in the document",
        "date": "Date of the invoice or transaction",
        "totalAmount": "Total amount paid",
        "modeOfPayment": "Mode of payment used"
      }
    `;
    const extractionResponse = await chain.call({ query: extractionQuery });

    const expenseDetails = JSON.parse(extractionResponse.text);

    return expenseDetails;
  } catch (error) {
    throw new Error(`Failed to extract expense details: ${error.message}`);
  }
};

const queryExpenseData = async (query, expenseData) => {
  try {
    // Preprocess the data
    const preprocessedExpenses = expenseData.map(expense => ({
      ...expense,
      date: new Date(expense.date).toLocaleDateString(),
      totalAmount: parseFloat(expense.totalAmount.replace(/[^0-9.-]+/g, "")).toFixed(2)
    }));

    // Group data by year
    const groupedData = preprocessedExpenses.reduce((acc, expense) => {
      const year = new Date(expense.date).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(expense);
      return acc;
    }, {});

    // Create a more readable string representation
    const expenseDataString = `The following is a summary of expense records grouped by year. Each record contains information about a user's expenses, including the company name, date, total amount, and mode of payment:

${Object.entries(groupedData)
  .map(([year, expenses]) => 
    `Year ${year} Expenses:\n${expenses.map(e => 
      `- ${e.companyName}: $${e.totalAmount} on ${e.date} (${e.modeOfPayment})`
    ).join('\n')}`
  ).join('\n\n')}`;

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.createDocuments([expenseDataString]);

    const vectorStore = await HNSWLib.fromDocuments(splitDocs, embeddings);

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever({ k: 5 }));

    // Add context to the query
    const contextualizedQuery = `Based on the following expense data, ${query}\n\nExpense Data:\n${expenseDataString}`;

    const response = await chain.call({ query: contextualizedQuery });

    return response.text;
  } catch (error) {
    throw new Error(`Failed to process query: ${error.message}`);
  }
};

const analyzeMonthlyFinances = async (expenseData, goalData) => {
  try {
    // Preprocess the expense data
    const preprocessedExpenses = expenseData.map(expense => ({
      ...expense,
      date: new Date(expense.date).toLocaleDateString(),
      totalAmount: parseFloat(expense.totalAmount.replace(/[^0-9.-]+/g, "")).toFixed(2)
    }));

    // Preprocess the goal data
    const preprocessedGoals = goalData.map(goal => ({
      ...goal,
      goalAmount: parseFloat(goal.goalAmount)
    }));

    // Group expenses by month and year
    const groupedExpenses = preprocessedExpenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(expense);
      return acc;
    }, {});

    // Calculate total expenses for each month
    const monthlyTotals = Object.entries(groupedExpenses).reduce((acc, [monthYear, expenses]) => {
      acc[monthYear] = expenses.reduce((sum, expense) => sum + parseFloat(expense.totalAmount), 0);
      return acc;
    }, {});

    // Create a string representation of the financial data
    const financialDataString = `
Monthly Expense and Goal Data:

${Object.entries(monthlyTotals).map(([monthYear, total]) => {
  const goal = preprocessedGoals.find(g => `${g.month} ${g.year}` === monthYear);
  return `${monthYear}:
  - Total Expenses: $${total.toFixed(2)}
  - Goal Amount: $${goal ? goal.goalAmount.toFixed(2) : 'N/A'}
  - Difference: $${goal ? (goal.goalAmount - total).toFixed(2) : 'N/A'}`;
}).join('\n\n')}
    `;

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.createDocuments([financialDataString]);

    const vectorStore = await HNSWLib.fromDocuments(splitDocs, embeddings);

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever({ k: 5 }));

    const query = `Based on the provided monthly expense and goal data, generate 3 to 4 concise suggestions on how to maintain proper financial discipline. Focus on practical advice that addresses spending patterns, goal achievement, and areas for improvement.Don't make it generic, cater the output based on the expenseData and goalData.`;

    const response = await chain.call({ query });

    return response.text;
  } catch (error) {
    throw new Error(`Failed to analyze monthly finances: ${error.message}`);
  }
};

module.exports = {
  extractInformation,
  extractExpenseDetails,
  queryExpenseData,
  analyzeMonthlyFinances
};