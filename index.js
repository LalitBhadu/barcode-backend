const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const qrRoutes = require("./routes/qrRoutes");
const companyRoutes = require("./routes/companyRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://lalitbhadu1111:wCYNW8Ln1bE7FQ1G@bar-code.nymzvwg.mongodb.net/barcodedb"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.use("/api", qrRoutes); // qr routes ✅ Must be here

app.use("/api/company", companyRoutes); // Company routes ✅ Must be here

app.get("/", (req, res) => {
  res.send("✅ QR Code API running (Completely Public Access)");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
