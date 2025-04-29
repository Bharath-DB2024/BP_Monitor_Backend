const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required:false,
    unique: true,
  },
  password: {
    type: String,
    required:false,
  },
  person: {
    type: String,
    required:false,
    unique: false,
  },
});

const User = mongoose.model('Users', userSchema);

module.exports = User;