const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createJobSeeker,
  getAllJobSeekers,
  updateJobSeeker,
  getJobSeekerByEmail

} = require("../controllers/jobSeekerController");

// dynamic storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    if (file.fieldname === "resume") folder = "uploads/resumes";
    else if (file.fieldname === "avatar") folder = "uploads/avatars";

    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const email = req.body.email;
    if (!email) return cb(new Error("Email is required"));

    if (file.fieldname === "avatar") {
      cb(null, `${email}-avatar.png`);
    } else if (file.fieldname === "resume") {
      cb(null, `${email}-resume.pdf`);
    }
  },
});

const upload = multer({ storage });

// routes
router.post(
  "/create",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "avatar", maxCount: 1 }
  ]),
  createJobSeeker
);

router.get("/all", getAllJobSeekers);
router.get("/:email", getJobSeekerByEmail);

router.put(
  "/update/:id",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "avatar", maxCount: 1 }
  ]),
  updateJobSeeker
);
module.exports = router;