const QRCode = require('qrcode');
const File = require('../../models/QRCodeModel');

// QR Code Generation Controller
exports.generateQRCode = async (req, res) => {
    try {
        // Find the file by ID
        const fileId = req.params.id;
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Check if the file is expired
        if (new Date() > file.expirationTime) {
            return res.status(400).json({
                success: false,
                message: 'The QR code has expired'
            });
        }

        // Generate a QR code URL that links to the file
        const fileURL = `http://localhost:5000/uploads/${file.fileName}`;  // Assuming files are served via a static route

        // Generate the QR code
        QRCode.toDataURL(fileURL, (err, qrCodeURL) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error generating QR code',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                qrCode: qrCodeURL
            });
        });

    } catch (error) {
        console.error('Error generating QR code:', error);
        return res.status(500).json({
            success: false,
            message: 'Error generating QR code',
            error: error.message
        });
    }
};
