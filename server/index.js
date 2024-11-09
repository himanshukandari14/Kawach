const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");
const dbConnection = require("./config/database");
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

require("dotenv").config();

// Middleware configuration
app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: "*",
    credentials: true
}));

// Configure file upload - IMPORTANT: Remove duplicate fileUpload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp'),
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached",
    debug: true, // Enable debugging
    uploadTimeout: 60000, // 60 seconds timeout
}));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create necessary directories
const uploadDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'temp');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Routes
const routes = require("./routes/route");
app.use(routes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// Database connection
dbConnection();
