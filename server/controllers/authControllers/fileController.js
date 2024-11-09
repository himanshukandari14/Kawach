const File = require('../../models/DocumentModel');
const path = require('path');
const moment = require('moment'); // For easy date manipulation
const fs = require('fs');

// File Upload Controller
exports.uploadFile = async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Get the uploaded file
        const uploadedFile = req.files.file;  // 'file' is the field name in the form

        // Set the file path where the file will be stored
        const uploadPath = path.join(__dirname, '../../uploads', uploadedFile.name);

        // Ensure the 'uploads' folder exists
        if (!fs.existsSync(path.dirname(uploadPath))) {
            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
        }

        // Move the file to the desired location
        uploadedFile.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'File upload failed',
                    error: err
                });
            }

            // Define expiration time (5 minutes from now)
            const expirationTime = moment().add(5, 'minutes').toDate();

            // Create a new file record in the database
            const newFile = new File({
                fileName: uploadedFile.name,
                filePath: uploadPath,
                uploadedBy: req.user.id,  // Assuming user is authenticated and has an ID
                expirationTime: expirationTime
            });

            // Save the file record to the database
            await newFile.save();

            return res.status(200).json({
                success: true,
                message: 'File uploaded successfully',
                file: newFile
            });
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
};
