const langchainService = require('../services/langChainService.js');

async function extractInformation (req, res) {
  try {
    const filePath = req.file.path;
    const extractedInfo = await langchainService.extractInformation(filePath);

    res.json({ extractedInformation: extractedInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = extractInformation;