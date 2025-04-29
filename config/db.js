// ./config/db.js
// const mongoose = require('mongoose');
// const dbURI = 'mongodb://127.0.0.1:27017/BPMonitor';  
// const connectDB = async () => {
//   try {
//     await mongoose.connect(dbURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('MongoDB connected...');
//   } catch (err) {
//     console.error('Error connecting to MongoDB:', err);
//     process.exit(1); // Exit the process if MongoDB connection fails
//   }
// };

// module.exports = connectDB;


require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI;  
const connectDB = async () => {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
};

module.exports = connectDB;