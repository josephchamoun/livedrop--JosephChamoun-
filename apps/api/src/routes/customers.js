const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET /api/customers?email=user@example.com
router.get('/', async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'email query param required' });
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) { next(err); }
});

// GET /api/customers/:id
router.get('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) { next(err); }
});

// POST /api/customers - Create new customer
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      return res.status(409).json({ error: 'Customer already exists', customer: existingCustomer });
    }

    // Create new customer
    const customer = new Customer({
      name: name || 'Guest User',
      email: email.toLowerCase(),
      phone: phone || '',
      address: address || ''
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (err) { 
    next(err); 
  }
});

module.exports = router;
