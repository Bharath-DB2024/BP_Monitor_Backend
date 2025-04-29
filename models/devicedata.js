const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  Device1: String,
  syst: Number,
  diast: Number,
  arter: Number,
  year: Number,
  month: Number,
  day: Number,
  hour: Number,
  minu: Number,
  sec: Number,
  puls: Number,
  doctor: String,
  patient:String
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;