const express = require("express");
const router = express.Router();
const Employer = require("../models/Employer");
const { createEmployer, getEmployers, updateEmployer } = require("../controllers/employerController");

// Create employer
router.post("/", createEmployer);

// Get all employers
router.get("/", getEmployers);

// Update employer by login email
router.put("/:email", updateEmployer);

// GET employer by email (for prefill)
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    const employer = await Employer.findOne({ email }); 
    if (!employer) {
      //Important: return success with null data for first-time creation
      return res.status(200).json({ success: true, data: null });
    }

    // Return consistent structure
    res.json({ success: true, data: employer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;