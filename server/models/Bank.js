const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  IFSC: { type: String },
  BANK: { type: String },
  CITY: { type: String },
  ADDRESS: { type: String },
  BANKCODE: { type: String },
  BRANCH: { type: String },
  CONTACT: { type: String },
  DISTRICT: { type: String },
  STATE: { type: String },
  RTGS: { type: Boolean },
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
