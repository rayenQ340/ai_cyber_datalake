const mongoose = require('mongoose');
module.exports = mongoose.model('Incident', new mongoose.Schema({
  src: String, 
  dst: String, 
  port: Number,
  attackClass: String,
  detectedBy: { 
    type: String,
    enum: ['Classifier', 'Anomaly model'] 
  },
  open: { 
    type: Boolean, 
    default: true 
  },
},
{ timestamps: true }));
