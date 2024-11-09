const User = require('../../models/UserModel');
const Document = require('../../models/DocumentModel');

// Get logged in user details
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user details',
            error: error.message
        });
    }
};

// Get all documents for logged in user
exports.getUserDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const documents = await Document.find({ user: userId })
            .select('-encryptionKey -encryptionIv') // Exclude sensitive data
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            count: documents.length,
            documents
        });
    } catch (error) {
        console.error('Error fetching user documents:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching documents',
            error: error.message
        });
    }
};

// Get single document details
exports.getDocumentById = async (req, res) => {
    try {
        const { documentId } = req.params;
        const userId = req.user.id;

        const document = await Document.findOne({
            _id: documentId,
            user: userId
        }).select('-encryptionKey -encryptionIv');

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            document
        });
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching document details',
            error: error.message
        });
    }
};

// Delete document
exports.deleteDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const userId = req.user.id;

        const document = await Document.findOne({
            _id: documentId,
            user: userId
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found or unauthorized'
            });
        }

        // Delete the actual file
        const filePath = path.join(__dirname, '../../uploads', path.basename(document.fileUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete document record
        await Document.findByIdAndDelete(documentId);

        res.status(200).json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting document',
            error: error.message
        });
    }
};

// Get document statistics
exports.getDocumentStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = await Document.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalDocuments: { $sum: 1 },
                    activeDocuments: {
                        $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
                    },
                    expiredDocuments: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $ne: ["$expiryTime", null] },
                                    { $lt: ["$expiryTime", new Date()] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: stats[0] || {
                totalDocuments: 0,
                activeDocuments: 0,
                expiredDocuments: 0
            }
        });
    } catch (error) {
        console.error('Error fetching document statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching document statistics',
            error: error.message
        });
    }
};
