const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [ItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['PENDING','PROCESSING','SHIPPED','DELIVERED'], default: 'PENDING' },
  carrier: String,
  estimatedDelivery: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update updatedAt on save
OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Fix OverwriteModelError for hot reload / dev
module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
