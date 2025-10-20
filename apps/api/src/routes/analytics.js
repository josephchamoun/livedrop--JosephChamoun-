
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');

/**
 * GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns: [{ date: '2025-10-01', revenue: 1234.56, orderCount: 3 }, ...]
 */
router.get('/daily-revenue', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: 'from and to required (YYYY-MM-DD)' });

    const fromDate = new Date(from);
    const toDate = new Date(to);
    // include the full toDate day
    toDate.setHours(23,59,59,999);

    const pipeline = [
      { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
      { $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: "$total" },
          orderCount: { $sum: 1 }
      }},
      { $project: {
          _id: 0,
          date: '$_id',
          revenue: 1,
          orderCount: 1
      }},
      { $sort: { date: 1 } }
    ];

    const results = await Order.aggregate(pipeline);
    res.json(results);
  } catch (err) { next(err); }
});

module.exports = router;
