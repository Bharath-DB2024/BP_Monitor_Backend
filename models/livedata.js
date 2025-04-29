const mongoose = require('mongoose');

// Define the schema for the device data
const deviceDataSchema = new mongoose.Schema({
  Device1: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  day: { type: Number, required: true },
  hour: { type: Number, required: true },
  minu: { type: Number, required: true },
  sec: { type: Number, required: true },
  flag1: { type: Number, required: true },
  syst: { type: Number, required: true },
  diast: { type: Number, required: true },
  arter: { type: Number, required: true },
  puls: { type: Number, required: true },
  user: { type: Number, required: true },
  flag2: { type: Number, required: true },
  name: { type: String, required:false },
  timestamp: { type: Date, default: Date.now } // Automatically set the current timestamp
});

const DeviceData = mongoose.model('Store', deviceDataSchema);

module.exports = DeviceData;
