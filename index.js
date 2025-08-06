const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bwipjs = require("bwip-js");
const Data = require("./models/DataModel");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Correct MongoDB Connection String (NO SPACES)
mongoose
  .connect(
    "mongodb+srv://lalitbhadu1111:wCYNW8Ln1bE7FQ1G@bar-code.nymzvwg.mongodb.net/barcodedb?retryWrites=true&w=majority&appName=bar-code"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/*------------------------------------------------------
 ✅ 1. Create Data API (POST)
------------------------------------------------------*/
app.post("/api/save-data", async (req, res) => {
  try {
    const newData = new Data(req.body);

    // Generate Unique Barcode
    const uniqueNum = Math.floor(100 + Math.random() * 900);
    newData.barcodeText = `${uniqueNum}EHCC`; // Example: 723EHCC

    // URL for scanning
    newData.scanUrl = `https://barcode.tradebiznetwork.com/scan/${newData.barcodeText}`;

    await newData.save();

    res.status(201).json({
      success: true,
      id: newData._id,
      barcodeText: newData.barcodeText,
      scanUrl: newData.scanUrl,
    });
  } catch (error) {
    console.error("Save Data Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/*------------------------------------------------------
 ✅ 2. Get All Data API
------------------------------------------------------*/
app.get("/api/all-data", async (req, res) => {
  try {
    const allData = await Data.find().sort({ createdAt: -1 });
    res.json(allData);
  } catch (error) {
    console.error("Fetch All Data Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/*------------------------------------------------------
 ✅ 3. Get Single Data by Barcode Text
------------------------------------------------------*/
app.get("/api/get-by-barcode/:code", async (req, res) => {
  try {
    const data = await Data.findOne({ barcodeText: req.params.code });
    if (!data) return res.status(404).json({ message: "No data found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*------------------------------------------------------
 ✅ 4. Generate Barcode Image (Smaller Size)
------------------------------------------------------*/
app.get("/api/barcode/:id", async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) return res.status(404).send("Data not found");

    // ✅ Ye wahi link hai jo scan hone par user ko milega
    const frontendUrl = `https://barcode.tradebiznetwork.com/scan/${data.barcodeText}`;

    bwipjs.toBuffer(
      {
        bcid: 'code128',        // ✅ Standard barcode format
        text: data.barcodeText, // ✅ Sirf code print hoga (723EHCC)
        scale: 2,               // ✅ Thoda thin bars
        height: 15,             // ✅ Small height (default 10–20 hota hai)
        includetext: true,      // ✅ Niche text likha hoga
        textxalign: 'center',   // ✅ Text center me
        textsize: 12,           // ✅ Text ka size
        paddingwidth: 6,
        paddingheight: 4
      },
      (err, png) => {
        if (err) {
          res.status(500).send("Error generating barcode");
        } else {
          res.type("image/png");
          res.send(png);
        }
      }
    );
  } catch (error) {
    res.status(500).send("Server error");
  }
});


/*------------------------------------------------------
 ✅ 5. Default Route
------------------------------------------------------*/
app.get("/", (req, res) => {
  res.send("✅ Barcode API running with MongoDB Atlas");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
