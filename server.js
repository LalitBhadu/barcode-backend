const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bwipjs = require("bwip-js");
const Data = require("./models/DataModel");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://lalitbhadu1111:wCYNW8Ln1bE7FQ1G@bar-code.nymzvwg.mongodb.net/?retryWrites=true&w=majority&appName=bar-code", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));


// ✅ Create Data API (POST)
// ✅ Create Data API (POST)
app.post("/api/save-data", async (req, res) => {
  try {
    const newData = new Data(req.body);

    // Generate Barcode Number
    const uniqueNum = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    newData.barcodeText = `${uniqueNum}EHCC`;

    // ✅ Generate URL for scanning
    newData.scanUrl = `http://localhost:3000/scan/${newData.barcodeText}`;

    await newData.save();

    res.status(201).json({ 
      success: true, 
      id: newData._id, 
      barcodeText: newData.barcodeText,
      scanUrl: newData.scanUrl
    });
  } catch (error) {
    console.error("Save Data Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get All Data API (GET)
app.get("/api/all-data", async (req, res) => {
  try {
    const allData = await Data.find().sort({ createdAt: -1 });
    res.json(allData);
  } catch (error) {
    console.error("Fetch All Data Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Generate Barcode Image API (GET)
app.get("/api/barcode/:id", async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) return res.status(404).send("Data not found");

    bwipjs.toBuffer({
      bcid: "code128",         // ✅ Keep it barcode (not QR)
      text: data.scanUrl,      // URL encoded in barcode
      scale: 1,                // ✅ smaller width
      height: 8,               // ✅ smaller height
      includetext: true,       // show text below barcode
      textxalign: "center",
      textsize: 8              // make text smaller
    }, (err, png) => {
      if (err) {
        res.status(500).send("Error generating barcode");
      } else {
        res.type("image/png");
        res.send(png);
      }
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});



mongoose.connection.on('connected', () => {
  console.log("✅ Database connected successfully");
});

mongoose.connection.on('error', (err) => {
  console.log("❌ DB connection error:", err);
});

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("✅ Barcode API running with MongoDB Atlas");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
