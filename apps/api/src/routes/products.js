const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products?search=&tag=&sort=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { 
      search, 
      tag, 
      sort = 'name', 
      page = 1, 
      limit = 20 
    } = req.query;
    
    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    if (tag) {
      filter.tags = tag;
    }
    
    // Parse pagination params
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;
    
    // Determine sort order
    let sortQuery = {};
    if (sort === 'price' || sort === 'asc') {
      sortQuery = { price: 1 };
    } else if (sort === '-price' || sort === 'desc') {
      sortQuery = { price: -1 };
    } else {
      sortQuery = { [sort]: 1 };
    }
    
    // Execute query with pagination
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter)
    ]);
    
    // Return products with pagination metadata
    res.json({
      products,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
        hasMore: skip + products.length < totalCount
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) { next(err); }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || price == null) return res.status(400).json({ error: 'name and price required' });
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) { next(err); }
});

module.exports = router;
