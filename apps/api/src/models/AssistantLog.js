const mongoose = require('mongoose');

const AssistantLogSchema = new mongoose.Schema({
  intent: { type: String, required: true },
  userInput: { type: String, required: true },
  functionsCalled: [{ type: String }],
  responseTime: { type: Number }, // milliseconds
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssistantLog', AssistantLogSchema);