const mongoose = require('mongoose');

// QRCode schema definition
const qrCodeSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  qrCodeImage: {
    type: String, // This will store the QR code as a data URL or file path
    required: true,
  },
  printToken: {
    type: String,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false
  }
});

// Add index for faster queries
qrCodeSchema.index({ document: 1, expiresAt: 1 });

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
