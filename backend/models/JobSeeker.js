const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  name: String,
  email: String,         // login email
  contactEmail: String,  //  form email
  phone: String,
  location: String,
  education: String,
  bio: String,
  skills: String,
  resume: String,
  avatar: String
});

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);