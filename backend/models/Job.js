
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, default: "Your Company" },
    location: { type: String },
    category: { type: String, required: true },
    jobType: { type: String, required: true },
    description: { type: String, required: true },
    qualifications: { type: String },
    responsibilities: { type: String, required: true },
    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },

      createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);