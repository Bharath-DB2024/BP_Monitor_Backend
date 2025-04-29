const mongoose = require('mongoose');

// Define the schema for the user profile and image data
const imageSchema = new mongoose.Schema({
  main: {
    type: String, // Assuming 'main' is a unique identifier
    required: true,
    unique: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  nurse: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  date: {
    type:String,
    required: true,
  },
 genter: {
    type:String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the image as a base64 string (if you're using base64 encoding)
    // Alternatively, if you prefer to store as a file reference, you can use type: Buffer or a URL
  },
});

// Create a model from the schema
const Patient = mongoose.model('Patient', imageSchema);

// Export the model
module.exports = Patient;
