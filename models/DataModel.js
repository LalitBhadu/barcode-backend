const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  uuid: { type: String, unique: true },
  details: String,
  scanUrl: String,
}, { timestamps: true });

module.exports = mongoose.model("Data", DataSchema);
