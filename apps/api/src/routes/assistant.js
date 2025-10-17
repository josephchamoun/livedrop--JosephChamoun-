// src/routes/assistant.js
const express = require('express');
const router = express.Router();
const { handleAssistantQuery } = require('../assistant/engine');

router.post('/query', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await handleAssistantQuery(message, context || {});
    res.json(result);
  } catch (error) {
    console.error('Assistant error:', error);
    res.status(500).json({ 
      error: 'Assistant temporarily unavailable',
      details: error.message 
    });
  }
});

module.exports = router;