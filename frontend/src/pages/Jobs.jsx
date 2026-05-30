import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaBriefcase, FaRupeeSign } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import Swal from "sweetalert2";
import API_URL from "../config";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const role = (user?.role || localStorage.getItem("role") || "").toLowerCase();

  const [appliedJobs, setAppliedJobs] = useState([]);
  const searchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`, {
        params: {
          ...(keyword.trim() && { keyword: keyword.trim() }),
          ...(location.trim() && { location: location.trim() }),
          ...(jobType && { jobType }),
        },
      });
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs", error);
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    searchJobs();
  }, []);

  //  DELETE JOB (only employer)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This job will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token"); // get JWT token
      await axios.delete(`${API_URL}/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // send it in header
        },
      });

      toast.success("Job deleted");
      searchJobs(); // refresh jobs
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job");
    }
  };

  useEffect(() => {
    searchJobs();
  }, [user]);

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/applications/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const appliedData = res.data.map((app) => ({
        jobId: app.job._id,
        applicationId: app._id,
      }));

      setAppliedJobs(appliedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);


  const handleUnapply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const app = appliedJobs.find(
        (a) => a.jobId.toString() === jobId.toString()
      );
      if (!app) return;

      await axios.delete(
        `${API_URL}/api/applications/${app.applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Application withdrawn");
      fetchAppliedJobs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to withdraw application");
    }
  };

  return (
    <Navbar>
      <div className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 min-h-screen w-full">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-semibold text-purple-300 mb-8 text-center md:text-left">
            Find Jobs
          </h1>

          {/* SEARCH */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-wrap gap-4">
            <input
              placeholder="Keyword"
              className="flex-1 p-3 rounded-lg border"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <input
              placeholder="Location"
              className="flex-1 p-3 rounded-lg border"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <select
              className="flex-1 p-3 rounded-lg border"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="" >
                Job Type
              </option>
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Remote</option>
            </select>

            <button
              onClick={searchJobs}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg"
            >
              Search
            </button>
          </div>

          {/* JOB CARDS */}
          <div className="flex flex-col gap-6">
            {jobs.length === 0 ? (
              <p className="text-white text-center col-span-full">
                No jobs found
              </p>
            ) : (
              jobs.map((job) => {
                const loggedInUserId = localStorage.getItem("userId");

                const isOwner =
                  loggedInUserId &&
                  job?.createdBy &&
                  job.createdBy.toString() === loggedInUserId.toString();

                const isApplied = appliedJobs.some(
                  (a) => a.jobId.toString() === job._id.toString()
                );
                return (
                  <div
                    key={job._id}
                    className="group bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-purple-800 group-hover:text-purple-900">
                        {job.title}
                      </h2>
                    </div>

                    {/* LOCATION */}
                    <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-purple-600" />
                      {job.location}
                    </p>

                    {/* TAGS */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        <FaBriefcase />
                        {job.jobType}
                      </span>

                      <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        <MdCategory />
                        {job.category}
                      </span>
                    </div>

                    {/* SALARY */}
                    <p className="text-green-600 font-semibold mb-2 flex items-center gap-1">
                      <FaRupeeSign />
                      {job.salaryMin} - {job.salaryMax}
                    </p>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-5">
                      {job.description}
                    </p>

                    {/* BUTTONS */}
                    <div className="flex gap-2 mt-auto">
                      {/* JOB SEEKER */}
                      {role === "job_seeker" && (
                        <button
                          onClick={async () => {
                            if (isApplied) {
                              await handleUnapply(job._id);
                            } else {
                              try {
                                const token = localStorage.getItem("token");
                                await axios.post(
                                 `${API_URL}/api/applications/apply`,
                                  { jobId: job._id },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                toast.success("Applied successfully!");
                                fetchAppliedJobs();
                              } catch (err) {
                                toast.error("Error applying");
                              }
                            }
                          }}
                          className={`px-5 py-2 rounded-lg text-white ${
                            isApplied
                              ? "bg-gray-400 hover:bg-gray-500"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {isApplied ? "Withdraw" : "Apply"}
                        </button>
                      )}

                      {/* EMPLOYER */}
                      {role === "employer" && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={() =>
                              isOwner && navigate(`/post-job/${job._id}`)
                            }
                            disabled={!isOwner}
                            className={`px-4 py-2 rounded-lg text-white transition ${
                              isOwner
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => isOwner && handleDelete(job._id)}
                            disabled={!isOwner}
                            className={`px-4 py-2 rounded-lg text-white transition ${
                              isOwner
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
}
