const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const jobSeekerRoutes = require("./routes/JobSeekerRoutes");
const employerRoutes = require("./routes/employerRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/jobportal")
.then(()=>console.log("MongoDB Connected"));

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/jobs",require("./routes/jobRoutes"));
app.use("/jobseeker", jobSeekerRoutes);
app.use("/api/employers", employerRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/uploads", express.static("uploads"));

app.listen(5000,()=>{
console.log("Server running on port 5000");
});

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const jobSeekerRoutes = require("./routes/JobSeekerRoutes");
// const employerRoutes = require("./routes/employerRoutes");
// const applicationRoutes = require("./routes/applicationRoutes");

// const http = require("http");
// const { initSocket } = require("./socket");
// const app = express();
// const server = http.createServer(app);



// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));
// app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1:27017/jobportal")
// .then(()=>console.log("MongoDB Connected"));

// app.use("/api/auth",require("./routes/authRoutes"));
// app.use("/api/jobs",require("./routes/jobRoutes"));
// app.use("/jobseeker", jobSeekerRoutes);
// app.use("/api/employers", employerRoutes);

// app.use("/api/applications", applicationRoutes);

// app.use("/uploads", express.static("uploads"));

// initSocket(server);

// server.listen(5000, () => { 
//   console.log("Server running on port 5000");
// });