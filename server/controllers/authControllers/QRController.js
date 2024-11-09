const QRCode = require('qrcode');
const QRCodeModel = require('../../models/QRCodeModel');
const Document = require('../../models/DocumentModel');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

// QR Code Generation Controller
exports.generateQRCode = async (req, res) => {
    try {
        const documentId = req.params.id;
        
        // Find document and verify ownership
        const document = await Document.findOne({
            _id: documentId,
            user: req.user.id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found or unauthorized'
            });
        }

        // Generate unique print token
        const printToken = crypto.randomBytes(32).toString('hex');

        // Create temporary access URL with your IP address
        const accessUrl = `http://192.168.0.253:5173/print/${documentId}/${printToken}`;
        
        console.log('Generated URL:', accessUrl); // Debug log
        
        // Generate QR code
        const qrCodeImage = await QRCode.toDataURL(accessUrl, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300
        });

        // Calculate expiry time (5 minutes from now)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Create new QR code record
        const newQRCode = new QRCodeModel({
            document: documentId,
            expiresAt,
            qrCodeImage,
            printToken
        });

        await newQRCode.save();

        res.status(201).json({
            success: true,
            data: {
                qrCode: qrCodeImage,
                expiresAt,
                printToken
            }
        });

    } catch (error) {
        console.error('QR generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate QR code'
        });
    }
};

// Get QR code details
exports.getQRCodeDetails = async (req, res) => {
    try {
        const { qrId } = req.params;
        
        const qrCode = await QRCodeModel.findById(qrId)
            .populate('document', 'title fileUrl');

        if (!qrCode) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found'
            });
        }

        // Check if user owns the associated document
        const document = await Document.findOne({
            _id: qrCode.document,
            user: req.user.id
        });

        if (!document) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                qrCode: qrCode.qrCodeImage,
                document: qrCode.document,
                generatedAt: qrCode.generatedAt,
                expiresAt: qrCode.expiresAt,
                isExpired: new Date() > qrCode.expiresAt
            }
        });

    } catch (error) {
        console.error('Error fetching QR code:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching QR code details',
            error: error.message
        });
    }
};

// List all QR codes for a document
exports.listDocumentQRCodes = async (req, res) => {
    try {
        const { documentId } = req.params;
        
        // Verify document ownership
        const document = await Document.findOne({
            _id: documentId,
            user: req.user.id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found or unauthorized'
            });
        }

        const qrCodes = await QRCodeModel.find({
            document: documentId
        }).sort({ generatedAt: -1 });

        res.status(200).json({
            success: true,
            count: qrCodes.length,
            data: qrCodes.map(qr => ({
                id: qr._id,
                generatedAt: qr.generatedAt,
                expiresAt: qr.expiresAt,
                isExpired: new Date() > qr.expiresAt
            }))
        });

    } catch (error) {
        console.error('Error listing QR codes:', error);
        res.status(500).json({
            success: false,
            message: 'Error listing QR codes',
            error: error.message
        });
    }
};

// Invalidate QR code
exports.invalidateQRCode = async (req, res) => {
    try {
        const { qrId } = req.params;
        
        const qrCode = await QRCodeModel.findById(qrId)
            .populate('document');

        if (!qrCode) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found'
            });
        }

        // Verify document ownership
        const document = await Document.findOne({
            _id: qrCode.document._id,
            user: req.user.id
        });

        if (!document) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        // Set expiry to now
        qrCode.expiresAt = new Date();
        await qrCode.save();

        res.status(200).json({
            success: true,
            message: 'QR code invalidated successfully'
        });

    } catch (error) {
        console.error('Error invalidating QR code:', error);
        res.status(500).json({
            success: false,
            message: 'Error invalidating QR code',
            error: error.message
        });
    }
};

// Verify QR access
exports.verifyQRAccess = async (req, res) => {
  try {
    const { documentId, token } = req.params;
    
    const qrCode = await QRCodeModel.findOne({
      document: documentId,
      printToken: token,
      expiresAt: { $gt: new Date() },
      isUsed: false
    }).populate('document');

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired QR code'
      });
    }

    res.json({
      success: true,
      document: {
        title: qrCode.document.title,
        id: qrCode.document._id
      }
    });
  } catch (error) {
    console.error('QR verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify QR code'
    });
  }
};

// Handle print request
exports.printDocument = async (req, res) => {
  try {
    const { documentId, token } = req.params;
    console.log('Print request for:', { documentId, token });

    const qrCode = await QRCodeModel.findOne({
      document: documentId,
      printToken: token,
      expiresAt: { $gt: new Date() },
      isUsed: false
    }).populate('document');

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired QR code'
      });
    }

    const document = qrCode.document;
    const filePath = path.join(__dirname, '../..', document.fileUrl);
    
    // Determine content type from file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.pdf': 'application/pdf'
    }[ext] || 'application/octet-stream';

    console.log('Document details:', {
      id: document._id,
      title: document.title,
      type: contentType,
      path: filePath
    });

    try {
      // Read file content
      const fileContent = await fs.readFile(filePath);
      console.log('File read:', {
        size: fileContent.length,
        type: contentType
      });

      // Set response headers
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileContent.length,
        'Content-Disposition': `inline; filename="${document.title}"`,
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      });

      // Send file content
      res.end(fileContent);

      // Mark QR code as used
      qrCode.isUsed = true;
      await qrCode.save();

    } catch (error) {
      console.error('File processing error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error processing file',
          error: error.message
        });
      }
    }
  } catch (error) {
    console.error('Print error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to process print request',
        error: error.message
      });
    }
  }
};
