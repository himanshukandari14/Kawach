const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// Default avatar URLs (you can replace these with your own or keep as is)
const defaultAvatars = [
  "https://asset.cloudinary.com/dplbyqi1k/76ecd6f79819ec711f734cd0dfe77ff5",
  "https://asset.cloudinary.com/dplbyqi1k/351c41bda987c3cbe5ef6862b955d6ea",
  "https://asset.cloudinary.com/dplbyqi1k/732d589c6438fa25e79798c7fe213078",
];

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxlength: [50, "Name can't exceed 50 characters"],
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
    lowercase: true, // Store emails in lowercase
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password can't be shorter than 8 characters"], // Password min length 8
  },
  avatar: {
    type: String,
    default: function () {
      // Select a random avatar from the list
      return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    },
  },
  bio: {
    type: String,
    maxlength: [160, "Bio can't be longer than 160 characters"], // Max length for bio
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date when the user is created
  },
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document", // Reference to documents uploaded by the user
    },
  ],
});