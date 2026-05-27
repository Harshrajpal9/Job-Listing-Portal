const Job = require("../models/Job");

// 🔍 GET (Search + Filters)
exports.getJobs = async (req, res) => {
  try {
    const { keyword, location, jobType } = req.query;

    let query = {};

    // Keyword
    if (keyword && keyword.trim() !== "") {
      query.$or = [
        { title: { $regex: keyword.trim(), $options: "i" } },
        { description: { $regex: keyword.trim(), $options: "i" } }
      ];
    }

    // Location
    if (location && location.trim() !== "") {
      query.location = { $regex: location.trim(), $options: "i" };
    }

    // Job Type
    if (jobType && jobType !== "") {
      query.jobType = jobType;
    }


    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ➕ CREATE JOB
exports.createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      createdBy: req.user._id // OR from auth middleware
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✏️ UPDATE JOB
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ❌ DELETE JOB
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

//  GET SINGLE JOB
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};