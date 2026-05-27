import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBriefcase,
  FaEye,
  FaTrash,
} from "react-icons/fa";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");

  //  Fetch Jobs from Backend
  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs/employer",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  //  Fetch Applications (Toggle logic included)
  const fetchApplications = async (job) => {
    if (selectedJob === job._id) {
      setSelectedJob(null);
      setApplications([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/applications/job/${job._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications(res.data);
      setSelectedJob(job._id);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load applications");
    }
  };

  //  Delete Job
  const handleDelete = async (jobId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/jobs/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Job deleted");
      fetchJobs();

      if (selectedJob === jobId) {
        setSelectedJob(null);
        setApplications([]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  return (
    <Navbar>
      <div className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 min-h-screen w-full">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <h1 className="text-4xl font-semibold text-purple-300 mb-10 flex items-center gap-3">
            <FaBriefcase /> Employer Dashboard
          </h1>

          {/* JOB LIST */}
          <div className="flex flex-col gap-6">
            {jobs.length === 0 ? (
              <p className="text-white text-center">No jobs posted yet</p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white/95 p-6 rounded-2xl shadow-lg border hover:shadow-2xl transition"
                >
                  <h2 className="text-xl font-bold text-purple-800 mb-2 flex items-center gap-2">
                    <FaBriefcase /> {job.title}
                  </h2>

                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <FaMapMarkerAlt /> {job.location}
                  </p>

                  <p className="text-gray-700 text-sm mt-1 flex items-center gap-2">
                    <FaRupeeSign />  {job.salaryMin} - {job.salaryMax}
                  </p>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => fetchApplications(job)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FaEye />
                      {selectedJob === job._id
                        ? "Hide Applicants"
                        : "View Applicants"}
                    </button>

                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* APPLICATIONS */}
          {selectedJob && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-purple-300 mb-6 flex items-center gap-2">
                <FaUsers />
                Applicants for{" "}
                {jobs.find((job) => job._id === selectedJob)?.title}
              </h2>

              {applications.length === 0 ? (
                <p className="text-white">No applications yet</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white/95 p-5 rounded-xl shadow-md border"
                    >
                      <p className="font-semibold text-gray-800 text-lg">
{app.applicant?.name}                      </p>

                      <p className="text-gray-500 text-sm">
{app.applicant?.email}                      </p>

                      <div className="mt-3 text-sm text-gray-700 space-y-1">
                        <p className="flex items-center gap-2">
                          <FaBriefcase /> {app.job?.title}
                        </p>

                        <p className="flex items-center gap-2">
                          <FaMapMarkerAlt /> {app.job?.location}
                        </p>

                        <p className="flex items-center gap-2">
                          <FaRupeeSign /> {app.job?.salaryMin} - {app.job?.salaryMax}
                        </p>
                      </div>

                      <p className="mt-3">
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            app.status === "accepted"
                              ? "text-green-600"
                              : app.status === "rejected"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {app.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default EmployerDashboard;