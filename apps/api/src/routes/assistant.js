// src/routes/assistant.js
const express = require('express');
const router = express.Router();
const { handleAssistantQuery } = require('../assistant/engine');

/**
 * POST /api/assistant/query
 */
router.post('/query', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message cannot be empty' 
      });
    }

    const startTime = Date.now();
    const result = await handleAssistantQuery(message, context || {});
    const responseTime = Date.now() - startTime;

    result.metadata = {
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    };

    res.json(result);

  } catch (error) {
    console.error('Assistant error:', error);
    res.status(500).json({ 
      error: 'Assistant temporarily unavailable',
      text: 'I apologize, but I\'m having technical difficulties right now.'
    });
  }
});

/**
 * GET /api/assistant/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    llm: {
      configured: !!process.env.LLM_URL,
      enhancementEnabled: process.env.USE_LLM_ENHANCEMENT === 'true'
    }
  });
});

module.exports = router;
