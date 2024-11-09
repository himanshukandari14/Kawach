const File = require('../../models/DocumentModel');
const path = require('path');
const moment = require('moment'); // For easy date manipulation
const fs = require('fs');

exports.uploadFile = async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const uploadedFile = req.files.file;  // 'file' is the field name in the form
        const uploadPath = path.join(__dirname, '../../uploads', uploadedFile.name);

        // Move the file to the desired location
        uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'File upload failed',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'File uploaded successfully',
                fileName: uploadedFile.name
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
};
