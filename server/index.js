const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieparser = require("cookie-parser");
const dbConnection = require("./config/database");
const fileUpload = require('express-fileupload');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// CORS configuration
app.use(cors());

// Configure file upload
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

app.get('/', (req, res) => {
  res.render('home.ejs', { title: 'Home' });
});

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

// Database connection
dbConnection();

// Routes
const routes = require("./routes/route");
app.use(routes);

app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No file was uploaded.');
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, 'uploads', file.name);

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
      fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
    }

    // Move the file to uploads directory
    await file.mv(uploadPath);
    
    res.send('File uploaded successfully!');
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send('Error occurred while uploading the file.');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
