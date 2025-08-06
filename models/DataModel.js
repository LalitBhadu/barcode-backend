const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  name: String,
  company: String,
  number: String,
  email: String,
  address: String,
  gst: String,
  product: String,
  barcodeText: String,
  scanUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Data", DataSchema);
