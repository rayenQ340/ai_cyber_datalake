const mongoose = require('mongoose');
module.exports = mongoose.model('Host', new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  risk: { type: Number, min: 0, max: 100, required: true },
  factors: String,
  status: { type: String, enum: ['Investigate', 'Review', 'Monitor'], default: 'Monitor' },
}));
