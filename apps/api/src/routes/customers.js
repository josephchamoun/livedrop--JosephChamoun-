const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

console.log('✅ Customers router loaded');

// GET /api/customers?email=user@example.com
router.get('/', async (req, res, next) => {
  console.log('📥 GET /api/customers', req.query);
  try {
    const { email } = req.query;
    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({ error: 'email query param required' });
    }
    
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
      console.log('❌ Customer not found:', email);
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    console.log('✅ Customer found:', customer._id);
    res.json(customer);
  } catch (err) { 
    console.error('❌ Error in GET /customers:', err);
    next(err); 
  }
});

// GET /api/customers/:id
router.get('/:id', async (req, res, next) => {
  console.log('📥 GET /api/customers/:id', req.params.id);
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      console.log('❌ Customer not found by ID:', req.params.id);
      return res.status(404).json({ error: 'Customer not found' });
    }
    console.log('✅ Customer found by ID:', customer._id);
    res.json(customer);
  } catch (err) {
    console.error('❌ Error in GET /customers/:id:', err);
    next(err);
  }
});

// POST /api/customers - Create new customer
router.post('/', async (req, res, next) => {
  console.log('📥 POST /api/customers', req.body);
  try {
    const { name, email, phone, address } = req.body;
    
    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      console.log('⚠️ Customer already exists:', existingCustomer._id);
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
    console.log('✅ Customer created:', customer._id);
    res.status(201).json(customer);
  } catch (err) { 
    console.error('❌ Error in POST /customers:', err);
    next(err); 
  }
});

module.exports = router;