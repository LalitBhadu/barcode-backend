const Company = require("../models/Company");

// CREATE Company
// CREATE Company
exports.createCompany = async (req, res) => {
  try {
    // destructuring aur directors/founders ko array mein convert karo
    let {
      companyName,
      registrationNumber,
      incorporationDate,
      type,
      directors,
      founders,
      email,
      phone,
      website,
      registeredAddress,
      operationalAddress,
      authorizedCapital,
      paidUpCapital,
      industry,
      businessActivity,
      numberOfEmployees,
      panNumber,
      gstNumber,
      logo,
      status,
    } = req.body;

    // String directors ko array mein convert karna (comma se split)
    const directorsArr = directors
      ? directors.split(",").map((d) => d.trim())
      : [];
    const foundersArr = founders
      ? founders.split(",").map((f) => f.trim())
      : [];

    const newCompany = new Company({
      companyName,
      registrationNumber,
      incorporationDate,
      type,
      directors: directorsArr,
      founders: foundersArr,
      email,
      phone,
      website,
      registeredAddress,
      operationalAddress,
      authorizedCapital,
      paidUpCapital,
      industry,
      businessActivity,
      numberOfEmployees,
      panNumber,
      gstNumber,
      logo,
      status,
    });

    const saved = await newCompany.save();

    res.status(201).json({
      message: "Company created successfully",
      company: saved,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// READ Companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json({ data: companies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ single company
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE Company
exports.updateCompany = async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Company updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE Company
exports.deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
