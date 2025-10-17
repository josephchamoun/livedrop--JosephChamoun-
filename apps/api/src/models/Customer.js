const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

// Fix OverwriteModelError
module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
