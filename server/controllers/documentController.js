const Document = require('../models/DocumentModel');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.files.file;
    console.log('Upload request:', {
      name: file.name,
      size: file.size
    });

    // Generate filename and encryption details
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const uploadPath = path.join(__dirname, '../../uploads', filename);
    const encryptionKey = crypto.randomBytes(32).toString('hex');
    const encryptionIv = crypto.randomBytes(16).toString('hex');

    try {
      // Move file to uploads directory
      await file.mv(uploadPath);
      console.log('File saved to:', uploadPath);

      // Create document record
      const newDocument = new Document({
        title: file.name,
        fileUrl: `/uploads/${filename}`,
        encryptionKey,
        encryptionIv,
        user: req.user.id,
        isActive: true
      });

      const savedDoc = await newDocument.save();
      console.log('Document saved:', {
        id: savedDoc._id,
        title: savedDoc.title,
        type: savedDoc.fileType
      });

      res.status(201).json({
        success: true,
        document: savedDoc
      });

    } catch (error) {
      console.error('File processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing file',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
}; 