const express = require("express");
const router = express.Router();

const verifyUser = require("../middleware/authMiddleware"); 

const {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    getEmployerJobs,
} = require("../controllers/jobController");

// Search + Get all
router.get("/", getJobs);

router.get("/employer", verifyUser, getEmployerJobs);

router.get("/:id", getJobById)

// Create
router.post("/", verifyUser, createJob); 
// Update
router.put("/:id", verifyUser, updateJob); 
// Delete
router.delete("/:id", verifyUser, deleteJob);

module.exports = router;