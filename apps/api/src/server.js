const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
require('dotenv').config();

const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const analyticsRouter = require('./routes/analytics');
const dashboardRouter = require('./routes/dashboard');
const assistant=require('./routes/assistant')

// ✅ ONLY import once with destructuring
const { router: orderStatusRouter, getActiveConnectionCount } = require('./sse/order-status');
const { handleAssistantQuery } = require('./assistant/engine');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(bodyParser.json());

// Connect DB
connectDB();

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/assistant', assistant);

// ⚠️ Mount SSE route (it will handle /api/orders/:id/stream)
app.use('/api/orders', orderStatusRouter);

// ⚠️ Mount orders CRUD routes AFTER SSE (order matters!)
app.use('/api/orders', ordersRouter);

// Metrics endpoint for SSE connection count
app.get('/api/metrics/sse-count', (req, res) => {
  res.json({ activeConnections: getActiveConnectionCount() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});