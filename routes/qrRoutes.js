const express = require("express");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const Data = require("../models/DataModel");

const router = express.Router();

const generateShortUUID = () => uuidv4().replace(/-/g, "").slice(0, 10);

// ✅ LOGIN (Optional - Dummy Only)
router.post("/login", (req, res) => {
  const { username, pin } = req.body;
  if (username === "admin" && pin === "1234") {
    return res.json({ success: true, token: "dummy-token" });
  }
  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// ✅ CREATE QR (Public - No Token)
router.post("/create", async (req, res) => {
  try {
    const { detailsArray } = req.body;
    const savedData = [];

    for (let details of detailsArray) {
      const uuid = generateShortUUID();
      const scanUrl = `http://localhost:3000/view/${uuid}`;
      const newData = new Data({ uuid, details, scanUrl });
      await newData.save();
      savedData.push(newData);
    }

    res.json({ success: true, data: savedData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET ALL QR (Public)
router.get("/list", async (req, res) => {
  try {
    const allData = await Data.find().sort({ createdAt: -1 });
    res.json({ total: allData.length, data: allData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET SINGLE QR (Public)
router.get("/get/:uuid", async (req, res) => {
  try {
    const data = await Data.findOne({ uuid: req.params.uuid });
    if (!data) return res.status(404).json({ message: "No data found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ UPDATE QR (Public)
router.put("/update/:uuid", async (req, res) => {
  try {
    const data = await Data.findOneAndUpdate(
      { uuid: req.params.uuid },
      { details: req.body.details, updatedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ DELETE QR (Public)
router.delete("/delete/:uuid", async (req, res) => {
  try {
    await Data.findOneAndDelete({ uuid: req.params.uuid });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ QR IMAGE (Public)
router.get("/qrcode/:uuid", async (req, res) => {
  try {
    const data = await Data.findOne({ uuid: req.params.uuid });
    if (!data) return res.status(404).send("Data not found");

    QRCode.toBuffer(data.scanUrl, { type: "png", width: 300 }, (err, buffer) => {
      if (err) return res.status(500).send("Error generating QR Code");
      res.type("image/png");
      res.send(buffer);
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
