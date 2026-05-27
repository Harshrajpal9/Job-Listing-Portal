const JobSeeker = require("../models/JobSeeker");

// Create Job Seeker Profile
exports.createJobSeeker = async (req, res) => {
  try {
    const loginEmail = req.body.email.toLowerCase().trim();
    let contactEmail = req.body.contactEmail?.toLowerCase().trim();

    //  If both emails are same → remove contactEmail
    if (loginEmail === contactEmail) {
      contactEmail = undefined;
    }

    //  Check existing using loginEmail
    const existing = await JobSeeker.findOne({ email: loginEmail });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const jobSeeker = new JobSeeker({
      name: req.body.name,
      email: loginEmail,              //  use variable
      contactEmail: contactEmail,     //  use cleaned value
      phone: req.body.phone,
      location: req.body.location,
      education: req.body.education,
      bio: req.body.bio,
      skills: req.body.skills,
      resume: req.files?.resume?.[0]?.filename || "",
      avatar: req.files?.avatar?.[0]?.filename || ""
    });

    await jobSeeker.save();

    res.json({ message: "Profile created successfully", jobSeeker });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};


// Get all Job Seekers
exports.getAllJobSeekers = async (req, res) => {
  try {
    const users = await JobSeeker.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getJobSeekerByEmail = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();

    const user = await JobSeeker.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};


// Update Job Seeker
exports.updateJobSeeker = async (req, res) => {
  try {
    const existingUser = await JobSeeker.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const fs = require("fs");
    const path = require("path");

    const loginEmail = existingUser.email;
    let contactEmail = req.body.contactEmail?.toLowerCase().trim();

    let updateData = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      education: req.body.education,
      bio: req.body.bio,
      skills: req.body.skills
    };

    // HANDLE AVATAR
  if (req.files?.avatar && req.files.avatar.length > 0) {
      if (existingUser.avatar) {
        const oldPath = path.join(__dirname, `../uploads/avatars/${existingUser.avatar}`);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updateData.avatar = req.files.avatar[0].filename;
    }

    // HANDLE RESUME
   if (req.files?.resume && req.files.resume.length > 0) {
      if (existingUser.resume) {
        const oldPath = path.join(__dirname, `../uploads/resumes/${existingUser.resume}`);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updateData.resume = req.files.resume[0].filename;
    }

    // ✅ Email logic AFTER everything
    let updateQuery;

    if (contactEmail && contactEmail !== loginEmail) {
      updateData.contactEmail = contactEmail;
      updateQuery = { $set: updateData };
    } else {
      updateQuery = { $set: updateData, $unset: { contactEmail: "" } };
    }

    const updatedUser = await JobSeeker.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true }
    );

    res.json(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};