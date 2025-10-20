// /apps/api/src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const AssistantLog = require('../models/AssistantLog');
const axios = require('axios');

// Import SSE connection counter
const { getActiveConnectionCount } = require('../sse/order-status');

/* -------------------------------------------------------------------------- */
/* 🧠 In-memory performance tracker                                           */
/* -------------------------------------------------------------------------- */
const metrics = {
  latencies: [],
  failedRequests: 0,
};

function trackLatency(startTime) {
  const latency = Date.now() - startTime;
  metrics.latencies.push(latency);
  // Keep only last 1000 measurements
  if (metrics.latencies.length > 1000) metrics.latencies.shift();
}

function avgLatency() {
  if (!metrics.latencies.length) return 0;
  const sum = metrics.latencies.reduce((a, b) => a + b, 0);
  return Math.round(sum / metrics.latencies.length);
}

/* -------------------------------------------------------------------------- */
/* 1️⃣ GET /api/dashboard/business-metrics                                     */
/* -------------------------------------------------------------------------- */
router.get('/business-metrics', async (req, res, next) => {
  const start = Date.now();
  try {
    // Total orders count
    const totalOrders = await Order.countDocuments();
    
    // Revenue aggregation
    const revenueAgg = await Order.aggregate([
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: '$total' }, 
          avgOrderValue: { $avg: '$total' } 
        } 
      }
    ]);
    
    const totals = revenueAgg[0] || { totalRevenue: 0, avgOrderValue: 0 };

    // Orders by status breakdown
    const statusAgg = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalOrders,
      totalRevenue: Math.round(totals.totalRevenue * 100) / 100,
      avgOrderValue: Math.round(totals.avgOrderValue * 100) / 100,
      ordersByStatus: statusAgg.map(s => ({ 
        status: s._id, 
        count: s.count 
      })),
    });
  } catch (err) {
    metrics.failedRequests++;
    console.error('Business metrics error:', err);
    next(err);
  } finally {
    trackLatency(start);
  }
});

/* -------------------------------------------------------------------------- */
/* 2️⃣ GET /api/dashboard/performance                                          */
/* -------------------------------------------------------------------------- */
router.get('/performance', async (req, res) => {
  const start = Date.now();
  try {
    // Get real SSE connection count from order-status module
    const activeSSE = getActiveConnectionCount();
    
    // Get LLM response times from AssistantLog
    const llmStats = await AssistantLog.aggregate([
      { $group: { 
          _id: null, 
          avgResponseTime: { $avg: '$responseTime' },
          count: { $sum: 1 }
      }}
    ]);
    
    const llmAvgTime = llmStats[0]?.avgResponseTime 
      ? Math.round(llmStats[0].avgResponseTime) 
      : 0;

    res.json({
      avgLatency: avgLatency(),
      activeSSEConnections: activeSSE,
      failedRequests: metrics.failedRequests,
      llmAvgResponseTime: llmAvgTime,
      totalRequests: metrics.latencies.length
    });
  } catch (err) {
    console.error('Performance metrics error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    trackLatency(start);
  }
});

/* -------------------------------------------------------------------------- */
/* 3️⃣ GET /api/dashboard/assistant-stats                                      */
/* -------------------------------------------------------------------------- */
router.get('/assistant-stats', async (req, res) => {
  const start = Date.now();
  try {
    // Total queries count
    const totalQueries = await AssistantLog.countDocuments();

    // Intent distribution
    const intentAgg = await AssistantLog.aggregate([
      { $group: { _id: '$intent', count: { $sum: 1 } } },
      { $project: { intent: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    // Function frequency (handle empty functionsCalled arrays)
    const functionAgg = await AssistantLog.aggregate([
      { $match: { functionsCalled: { $exists: true, $ne: [] } } },
      { $unwind: '$functionsCalled' },
      { $group: { _id: '$functionsCalled', count: { $sum: 1 } } },
      { $project: { function: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    // Average response time by intent
    const avgResponseTimeByIntent = await AssistantLog.aggregate([
      { 
        $group: { 
          _id: '$intent', 
          avgResponseTime: { $avg: '$responseTime' },
          count: { $sum: 1 }
        }
      },
      { 
        $project: { 
          intent: '$_id', 
          avgResponseTime: { $round: ['$avgResponseTime', 0] },
          count: 1,
          _id: 0 
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalQueries,
      intentDistribution: intentAgg,
      functionFrequency: functionAgg,
      avgResponseTimeByIntent
    });
  } catch (err) {
    console.error('Assistant stats error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    trackLatency(start);
  }
});

/* -------------------------------------------------------------------------- */
/* 4️⃣ GET /api/dashboard/health                                               */
/* -------------------------------------------------------------------------- */
async function pingLLMService() {
  try {
    const LLM_URL = process.env.LLM_URL;
    
    if (!LLM_URL) {
      console.log('⚠️ LLM_URL not configured in environment');
      return false;
    }

    // Try to ping the /generate endpoint
    const url = LLM_URL.endsWith('/generate') ? LLM_URL : `${LLM_URL}/generate`;
    
    console.log(`🔍 Pinging LLM at: ${url}`);
    
    const res = await axios.post(url, { 
      prompt: 'test', 
      max_tokens: 10 
    }, { 
      timeout: 5000,
      validateStatus: (status) => status < 500 // Accept 2xx, 3xx, 4xx
    });
    
    console.log(`✅ LLM responded with status: ${res.status}`);
    return res.status >= 200 && res.status < 500;
    
  } catch (err) {
    console.error('❌ LLM ping failed:', err.message);
    return false;
  }
}

router.get('/health', async (req, res) => {
  const start = Date.now();
  try {
    // Database status
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    // LLM status (with detailed check)
    const llmOnline = await pingLLMService();
    
    // Last update timestamp
    const lastUpdate = new Date().toISOString();
    
    // Get active SSE connections
    const activeSSE = getActiveConnectionCount();

    res.json({ 
      database: {
        status: dbStatus,
        readyState: mongoose.connection.readyState
      },
      llm: {
        status: llmOnline ? 'Online' : 'Offline',
        url: process.env.LLM_URL || 'Not configured'
      },
      sse: {
        activeConnections: activeSSE
      },
      lastUpdate,
      timestamp: Date.now()
    });
  } catch (err) {
    metrics.failedRequests++;
    console.error('Health check error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    trackLatency(start);
  }
});

/* -------------------------------------------------------------------------- */
/* 5️⃣ GET /api/dashboard/overview (All metrics in one call)                   */
/* -------------------------------------------------------------------------- */
router.get('/overview', async (req, res) => {
  const start = Date.now();
  try {
    // Business metrics
    const totalOrders = await Order.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, avgOrderValue: { $avg: '$total' } } }
    ]);
    const totals = revenueAgg[0] || { totalRevenue: 0, avgOrderValue: 0 };
    
    const statusAgg = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Assistant stats
    const totalQueries = await AssistantLog.countDocuments();
    const intentAgg = await AssistantLog.aggregate([
      { $group: { _id: '$intent', count: { $sum: 1 } } },
      { $project: { intent: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    // Health
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const llmOnline = await pingLLMService();
    const activeSSE = getActiveConnectionCount();

    res.json({
      business: {
        totalOrders,
        totalRevenue: Math.round(totals.totalRevenue * 100) / 100,
        avgOrderValue: Math.round(totals.avgOrderValue * 100) / 100,
        ordersByStatus: statusAgg.map(s => ({ status: s._id, count: s.count }))
      },
      assistant: {
        totalQueries,
        intentDistribution: intentAgg
      },
      performance: {
        avgLatency: avgLatency(),
        activeSSEConnections: activeSSE,
        failedRequests: metrics.failedRequests
      },
      health: {
        database: dbStatus,
        llm: llmOnline ? 'Online' : 'Offline',
        lastUpdate: new Date().toISOString()
      }
    });
  } catch (err) {
    metrics.failedRequests++;
    console.error('Overview error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    trackLatency(start);
  }
});

module.exports = router;