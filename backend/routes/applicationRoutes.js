const express = require("express");
const router = express.Router();

const verifyUser = require("../middleware/authMiddleware");
const Application = require("../models/Application");

const {
  applyJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
    withdrawApplication,
     getApplicationsByJob,
} = require("../controllers/applicationController");


// 👨‍🎓 JOB SEEKER
router.post("/apply", verifyUser, applyJob);
router.get("/my", verifyUser, getMyApplications);


// 🧑‍💼 EMPLOYER
router.get("/employer", verifyUser, getEmployerApplications);

router.get("/job/:jobId", verifyUser, getApplicationsByJob);

router.put("/:id", verifyUser, updateApplicationStatus);



// Withdraw
router.delete("/:id", verifyUser, withdrawApplication);


module.exports = router;