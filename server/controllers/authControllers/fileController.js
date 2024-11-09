const Document = require('../../models/DocumentModel');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

exports.uploadFile = async (req, res) => {
    try {
        // Debug logging
        console.log('Request files:', req.files);
        console.log('Request body:', req.body);
        console.log('User data:', req.user); // Debug user data

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated properly'
            });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files were uploaded.'
            });
        }

        const file = req.files.file;
        
        // Validate file
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'File must be uploaded with field name "file"'
            });
        }

        // Generate encryption details
        const algorithm = 'aes-256-cbc';
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        
        // Create unique filename
        const fileName = `${Date.now()}-${file.name}`;
        const uploadDir = path.join(__dirname, '../../uploads');

        // Ensure upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Move file to temporary location
        const tempPath = path.join(uploadDir, 'temp_' + fileName);
        await file.mv(tempPath);

        // Read file and encrypt
        const fileBuffer = fs.readFileSync(tempPath);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encryptedData = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);

        // Save encrypted file
        const finalPath = path.join(uploadDir, fileName);
        fs.writeFileSync(finalPath, encryptedData);

        // Remove temporary file
        fs.unlinkSync(tempPath);

        // Create document record with correct user ID
        const document = new Document({
            user: req.user.id, // Changed to use req.user.id directly
            title: file.name,
            fileUrl: `/uploads/${fileName}`,
            encryptionKey: key.toString('hex'),
            encryptionIv: iv.toString('hex'),
        });

        await document.save();

        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            documentId: document._id
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
};
