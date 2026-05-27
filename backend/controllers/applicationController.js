const Application = require("../models/Application");
const Job = require("../models/Job");
const JobSeeker = require("../models/JobSeeker");


//  APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "Job ID required" });

    const job = await Job.findById(jobId);
    
    // FETCH JOB SEEKER PROFILE
    const profile = await JobSeeker.findOne({
      email: req.user.email,
    });

    if (!profile) {
      return res.status(400).json({
        message: "Please complete your profile first",
      });
    }
    if (!job) return res.status(404).json({ message: "Job not found" });

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (alreadyApplied) return res.status(400).json({ message: "Already applied" });

    const application = await Application.create({
      job: job._id,
      jobTitle: job.title, // store job title
      applicant: req.user._id,
      applicantName: req.user.name, // store applicant name
      applicantEmail: req.user.email, // store applicant email
      applicantProfile: profile._id,
    });

    res.status(201).json({ message: "Applied successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// 👨‍🎓 GET MY APPLICATIONS
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// 🧑‍💼 GET EMPLOYER APPLICATIONS
exports.getEmployerApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).select("_id");
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({
      job: { $in: jobIds }
    }).populate("applicantProfile").sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//  UPDATE STATUS (Accept / Reject)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    //  Only employer who posted job can update
    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: `Application ${status}`,
      application,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  WITHDRAW / UNAPPLY JOB
exports.withdrawApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const applicationId = req.params.id; //  FIX

    const application = await Application.findOne({
      _id: applicationId,
      applicant: userId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.deleteOne();

    res.json({ message: "Application withdrawn successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate("job")
      .populate("applicant", "name email");

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
