const express=require('express');
const router=express.Router();


// import controllers
const { register, login, resetPassword, deleteUser,getUser, forgotPassword, updateUserDetails } = require('../controllers/authControllers/authcontroller');
const {verifyToken, isMentor}=require('../middleware/Auth');
const { createCourse, deleteCourse, getAllCourse, getCourse, addToCart,searchCourse } = require('../controllers/authControllers/authcontroller');
const { uploadFile } = require('../controllers/authControllers/fileController');
const { generateQRCode, getQRCodeDetails, listDocumentQRCodes, invalidateQRCode } = require('../controllers/authControllers/QRController');
const {
    getUserDetails,
    getUserDocuments,
    getDocumentById,
    deleteDocument,
    getDocumentStats
} = require('../controllers/authControllers/userController');

router.post('/register',register);
router.post('/login',login)
router.get('/getuser',verifyToken,getUser);
router.post('/resetpassword',verifyToken,resetPassword);
router.delete('/deleteuser',verifyToken,deleteUser);
router.post('/forgotPassword',forgotPassword);


// File upload route
router.post('/upload',verifyToken, uploadFile);

// QR code generation route
router.get('/qr/:id', generateQRCode);



// router.post('/createcourse',verifyToken,isMentor,createCourse);
// router.delete('/deleteCourse/:id', verifyToken, deleteCourse); 
// router.get('/course/:id',verifyToken,getCourse);
// router.get('/user/search',searchCourse);
// router.post('/user/updateDetails',verifyToken,updateUserDetails)
// router.delete('/deleteaccount',verifyToken,deleteUser);

// User and Document routes
router.get('/user/profile', verifyToken, getUserDetails);
router.get('/user/documents', verifyToken, getUserDocuments);
router.get('/user/documents/:documentId', verifyToken, getDocumentById);
router.delete('/user/documents/:documentId', verifyToken, deleteDocument);
router.get('/user/document-stats', verifyToken, getDocumentStats);

// QR Code routes
router.post('/documents/:id/qr', verifyToken, generateQRCode);
router.get('/qr/:qrId', verifyToken, getQRCodeDetails);
router.get('/documents/:documentId/qr-codes', verifyToken, listDocumentQRCodes);
router.post('/qr/:qrId/invalidate', verifyToken, invalidateQRCode);

module.exports=router;
