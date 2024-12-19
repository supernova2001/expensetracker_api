const { OpenAI } = require("@langchain/openai");
const { OpenAIEmbeddings } = require("@langchain/openai");

const model = new OpenAI({ 
    openAIApiKey: process.env.OPEN_AI_KEY,
    temperature: 0,
    maxTokens: 3000 
});

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_AI_KEY
});

module.exports = {model,embeddings};