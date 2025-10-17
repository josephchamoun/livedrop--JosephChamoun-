const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  tags: [String],
  imageUrl: String,
  stock: { type: Number, default: 0 }
});

// Fix OverwriteModelError
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
