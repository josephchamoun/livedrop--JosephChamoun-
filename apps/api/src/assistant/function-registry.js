// src/assistant/function-registry.js
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

class FunctionRegistry {
  constructor() {
    this.functions = {};
  }

  register(name, schema, func) {
    this.functions[name] = { schema, func };
  }

  getAllSchemas() {
    return Object.fromEntries(
      Object.entries(this.functions).map(([k, v]) => [k, v.schema])
    );
  }

  async execute(name, args) {
    if (!this.functions[name]) throw new Error(`Unknown function: ${name}`);
    return await this.functions[name].func(args);
  }
}

const registry = new FunctionRegistry();

// ---------------------------
// Function 1: Get Order Status
// ---------------------------
registry.register(
  'getOrderStatus',
  {
    description: 'Get current status of a specific order',
    parameters: { orderId: 'string' },
  },
  async ({ orderId }) => {
    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) return 'Invalid order ID';

    const order = await Order.findById(orderId);
    return order ? order.status : 'Order not found';
  }
);

// ---------------------------
// ---------------------------
// Function 2: Search Products
// ---------------------------
registry.register(
  'searchProducts',
  {
    description: 'Search products by keyword',
    parameters: { query: 'string', limit: 'number' },
  },
  async ({ query, limit = 5 }) => {
    const words = query.split(' ').filter(Boolean); // split query into words
    const regexes = words.map(word => new RegExp(word, 'i')); // make each word case-insensitive

    return await Product.find({
      $or: regexes.map(r => ({ name: r })) // match any word in name
    })
    .limit(limit)
    .select('_id name price');
  }
);



// ---------------------------
// Function 3: Get Customer Orders
// ---------------------------
registry.register(
  'getCustomerOrders',
  {
    description: 'Fetch orders for a given customer email',
    parameters: { email: 'string' },
  },
  async ({ email }) => {
    const customer = await Customer.findOne({ email });
    if (!customer) return [];
    return await Order.find({ customerId: customer._id }).select('_id status total createdAt');
  }
);

module.exports = registry;
