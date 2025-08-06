const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

router.post("/create", companyController.createCompany);
router.get("/list", companyController.getCompanies);
router.get("/:id", companyController.getCompany);
router.put("/update/:id", companyController.updateCompany);
router.delete("/delete/:id", companyController.deleteCompany);

module.exports = router;
