require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const jobSeekerRoutes = require("./routes/JobSeekerRoutes");
const employerRoutes = require("./routes/employerRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/jobs",require("./routes/jobRoutes"));
app.use("/jobseeker", jobSeekerRoutes);
app.use("/api/employers", employerRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/uploads", express.static("uploads"));

app.listen(5000,()=>{
console.log("Server running on port 5000");
});
