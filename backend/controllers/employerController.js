const Employer = require("../models/Employer");

// CREATE employer profile
const createEmployer = async (req, res) => {
  try {
    const employer = new Employer({
      ...req.body,
      email: req.body.email.toLowerCase().trim(),
    });
    const savedEmployer = await employer.save();

    res.status(201).json({
      success: true,
      data: savedEmployer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE employer profile
const updateEmployer = async (req, res) => {
  try {
    const loginEmail = req.params.email.toLowerCase().trim();

    const updatedEmployer = await Employer.findOneAndUpdate(
      { email: loginEmail }, // match login email
      {
        ...req.body,
        email: req.body.email.toLowerCase().trim(),
      },
      { new: true }
    );

    if (!updatedEmployer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    res.json({
      success: true,
      data: updatedEmployer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET all employers
const getEmployers = async (req, res) => {
  try {
    const employers = await Employer.find();
    res.json({
      success: true,
      data: employers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createEmployer, getEmployers, updateEmployer };

