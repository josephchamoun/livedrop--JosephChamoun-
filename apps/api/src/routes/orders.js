const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

// POST /api/orders
router.post('/', async (req, res, next) => {
  try {
    const { customerEmail, items, carrier, estimatedDelivery } = req.body;
    if (!customerEmail || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'customerEmail and items[] required' });
    }

    const customer = await Customer.findOne({ email: customerEmail.toLowerCase() });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    // validate items and compute total
    let total = 0;
    const populatedItems = [];
    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product) return res.status(400).json({ error: `Invalid productId ${it.productId}` });
      if (product.stock < (it.quantity || 1)) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      const quantity = it.quantity || 1;
      populatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity
      });
      total += product.price * quantity;
      // optionally adjust stock here or in separate fulfillment step
    }

    const order = new Order({
      customerId: customer._id,
      items: populatedItems,
      total,
      carrier,
      estimatedDelivery
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) { next(err); }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('customerId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
});

// GET /api/orders?customerId=:customerId
router.get('/', async (req, res, next) => {
  try {
    const { customerId } = req.query;
    if (customerId) {
      const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      // return all orders or paginate
      const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
      res.json(orders);
    }
  } catch (err) { next(err); }
});

module.exports = router;
