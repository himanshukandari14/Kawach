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
  encryptionKey: {
    type: String,
    required: true,
  },
  encryptionIv: {
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
  isActive: {
    type: Boolean,
    default: true,
  },
  qrCode: {
    type: String,
    default: null
  },
  printToken: {
    type: String,
    default: null
  }
});

// Add a post-save middleware to update the user's documents array
documentSchema.post('save', async function(doc) {
  try {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(
      doc.user,
      { $addToSet: { documents: doc._id } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user documents:', error);
  }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
