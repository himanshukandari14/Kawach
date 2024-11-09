const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

// User schema definition
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});




const User = mongoose.model('User', userSchema);

module.exports = User;
