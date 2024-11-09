const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");
const dbConnection = require("./config/database");
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');  // Import the path module


require("dotenv").config();

const cookieParser = require('cookie-parser');


// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to handle file uploads
app.use(fileUpload());

const PORT = process.env.PORT || 8000;
// middleware
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json()); //for parsing body
app.use(cookieparser()); //for parsing cookie

// Middleware to handle file uploads
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'temp') // Ensure this folder exists or choose a valid path
}));


// listen to port
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
// db connect
dbConnection();

//import route
const routes = require("./routes/route");
app.use(routes);
