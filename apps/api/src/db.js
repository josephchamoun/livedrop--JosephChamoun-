
// src/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // ensure .env is loaded

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI env var is missing');
    console.log('Attempting to connect to MongoDB with URI prefix:', uri.slice(0, 30) + '...');
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
