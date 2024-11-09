const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ error: "Token not found" });
    }
    const token = authorization.split(" ")[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set user ID directly
    req.user = {
      id: decoded.id // Match this with the payload structure in generateToken
    };
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// Update token generation to include just the necessary user data
const generateToken = (userData) => {
  return jwt.sign(
    { 
      id: userData.id,
      email: userData.email 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: "12h" }
  );
};

module.exports = { verifyToken, generateToken };