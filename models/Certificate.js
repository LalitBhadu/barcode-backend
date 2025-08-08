const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
