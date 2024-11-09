const mongoose = require('mongoose');

// Document schema definition
const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiryTime: {
    type: Date,
    default: null, // Set on QR generation
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
