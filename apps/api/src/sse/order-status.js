
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order'); // make sure path is correct

// In-memory maps
const connections = new Map();   // orderId => Set<res>
const simulations = new Map();   // orderId => { running: bool, timers: [] }


// Helper to send SSE event
function sendEvent(res, eventName, data, id) {
  if (id !== undefined) res.write(`id: ${id}\n`);
  if (eventName) res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// Broadcast to all connected clients for an order
async function broadcast(orderId, eventName, data) {
  const conns = connections.get(orderId);
  if (!conns) return;
  for (const res of conns) {
    try { sendEvent(res, eventName, data, data.eventId || Date.now()); }
    catch (_) { /* ignore */ }
  }
}

// Advance order status
async function advanceStatus(order) {
  const flow = ['PENDING','PROCESSING','SHIPPED','DELIVERED'];
  const idx = flow.indexOf(order.status);
  if (idx === -1 || idx === flow.length - 1) return order;
  order.status = flow[idx + 1];
  order.updatedAt = new Date();
  await order.save();
  return order;
}

// Simulate order progress
function startSimulation(orderId, deterministic = false) {
  if (simulations.get(orderId)?.running) return;
  const sim = { running: true, timers: [] };
  simulations.set(orderId, sim);

  const scheduleNext = async () => {
    try {
      const order = await Order.findById(orderId);
      if (!order) { cleanupSimulation(orderId); return; }
      if (order.status === 'DELIVERED') {
        await broadcast(orderId, 'status', { orderId, status: 'DELIVERED', updatedAt: order.updatedAt, eventId: Date.now() });
        cleanupSimulation(orderId);
        return;
      }

      const delays = { 'PENDING': [3000,5000], 'PROCESSING':[5000,7000], 'SHIPPED':[5000,7000] };
      const [min,max] = delays[order.status] || [5000,7000];
      const delay = deterministic ? 50 : Math.floor(Math.random() * (max - min + 1)) + min;

      const t = setTimeout(async () => {
        try {
          const updated = await advanceStatus(order);
          await broadcast(orderId, 'status', {
            orderId,
            status: updated.status,
            carrier: updated.carrier || null,
            estimatedDelivery: updated.estimatedDelivery || null,
            updatedAt: updated.updatedAt,
            eventId: Date.now()
          });
          if (updated.status !== 'DELIVERED') scheduleNext();
          else cleanupSimulation(orderId);
        } catch (err) {
          console.error(err); cleanupSimulation(orderId);
        }
      }, delay);

      sim.timers.push(t);
    } catch (err) {
      console.error(err); cleanupSimulation(orderId);
    }
  };

  scheduleNext();
}

// Cleanup timers
function cleanupSimulation(orderId) {
  const sim = simulations.get(orderId);
  if (sim) { sim.timers.forEach(t => clearTimeout(t)); simulations.delete(orderId); }
}

// SSE route
router.get('/:id/stream', async (req, res) => {
  const orderId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).json({ error: 'Invalid order id' });

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*' // for dev
  });
  res.flushHeaders();

  // Keep-alive
  const keepAlive = setInterval(() => res.write(': keep-alive\n\n'), 25000);

  if (!connections.has(orderId)) connections.set(orderId, new Set());
  connections.get(orderId).add(res);

  try {
    const order = await Order.findById(orderId).lean();
    if (!order) {
      sendEvent(res, 'error', { message: 'Order not found' }, Date.now());
      res.end();
      clearInterval(keepAlive);
      return;
    }

    sendEvent(res, 'status', {
      orderId,
      status: order.status,
      carrier: order.carrier || null,
      estimatedDelivery: order.estimatedDelivery || null,
      updatedAt: order.updatedAt || order.createdAt,
      eventId: Date.now()
    });
  } catch (err) {
    sendEvent(res, 'error', { message: 'Server error' }, Date.now());
    res.end();
    clearInterval(keepAlive);
    return;
  }

  const deterministic = req.query.deterministic === 'true';
  startSimulation(orderId, deterministic);

  req.on('close', () => {
    clearInterval(keepAlive);
    const conns = connections.get(orderId);
    if (conns) {
      conns.delete(res);
      if (conns.size === 0) connections.delete(orderId);
    }
  });
});

function getActiveConnectionCount() {
  let total = 0;
  for (const conns of connections.values()) {
    total += conns.size;
  }
  return total;
}

module.exports = { router, getActiveConnectionCount };


