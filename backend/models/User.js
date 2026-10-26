const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    trim: true 
    },
  email: { 
    type: String,
    required: true,
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  role: { 
    type: String, 
    enum: ['SOC analyst', 'Security engineer', 'Data scientist', 'Student'], 
    default: 'SOC analyst' 
  },
  password: { 
    type: String, 
    required: true 
  },
}, 
{ timestamps: true });
module.exports = mongoose.model('User', userSchema);
