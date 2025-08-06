const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  username: String,
  token: String,
  createdAt: { type: Date, default: Date.now, expires: "1h" } // auto delete after 1 hour
});

module.exports = mongoose.model("Token", TokenSchema);
