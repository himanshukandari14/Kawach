
const express=require('express');
const router=express.Router();


// import controllers
const { register, login, resetPassword, deleteUser,getUser, forgotPassword, updateUserDetails } = require('../controllers/authControllers/authcontroller');
const {verifyToken, isMentor}=require('../middleware/Auth');
const { createCourse, deleteCourse, getAllCourse, getCourse, addToCart,searchCourse } = require('../controllers/authControllers/authcontroller');
const { uploadFile } = require('../controllers/authControllers/fileController');
const { generateQRCode } = require('../controllers/authControllers/QRController');

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

module.exports=router;
