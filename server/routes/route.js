
const express=require('express');
const router=express.Router();


// import controllers
const { register, login, resetPassword, deleteUser,getUser, forgotPassword, updateUserDetails } = require('../controllers/authControllers/authcontroller');
const {verifyToken, isMentor}=require('../middleware/Auth');
const { createCourse, deleteCourse, getAllCourse, getCourse, addToCart,searchCourse } = require('../controllers/authControllers/authcontroller');

router.post('/register',register);
router.post('/login',login)
router.get('/getuser',verifyToken,getUser);
router.post('/resetpassword',verifyToken,resetPassword);
router.delete('/deleteuser',verifyToken,deleteUser);
router.post('/forgotPassword',forgotPassword);


// course  routes



// router.post('/createcourse',verifyToken,isMentor,createCourse);
// router.delete('/deleteCourse/:id', verifyToken, deleteCourse); 
// router.get('/course/:id',verifyToken,getCourse);
// router.get('/user/search',searchCourse);
// router.post('/user/updateDetails',verifyToken,updateUserDetails)
// router.delete('/deleteaccount',verifyToken,deleteUser);

module.exports=router;
