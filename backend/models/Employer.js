const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    companyName: String,
    description: String,
    website: String,
    contactEmail: String,
    location: String,
    contactPerson: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);