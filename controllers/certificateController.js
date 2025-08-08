const Certificate = require('../models/Certificate');

// Create new certificate
exports.createCertificate = async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    await certificate.save();
    res.status(201).json(certificate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all certificates
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get certificate by ID
exports.getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update certificate by ID
exports.updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete certificate by ID
exports.deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
