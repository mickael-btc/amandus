// @ts-check
const mongoose = require("mongoose");

const dkim = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
  },
  selector: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  dkimRecord: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("dkim", dkim);