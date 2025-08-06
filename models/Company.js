const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: String,
  registrationNumber: String,
  incorporationDate: Date,
  type: { type: String, default: "Private Limited" },
  directors: [String],
  founders: [String],
  email: String,
  phone: String,
  website: String,
  registeredAddress: String,
  operationalAddress: String,
  authorizedCapital: String,
  paidUpCapital: String,
  industry: String,
  businessActivity: String,
  numberOfEmployees: Number,
  panNumber: String,
  gstNumber: String,
  logo: String,
  status: { type: String, default: "Active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", companySchema);
