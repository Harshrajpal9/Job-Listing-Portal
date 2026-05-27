import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaClipboardList,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  //  FETCH APPLICATIONS
  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/applications/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load applications");
    }
  };

  //  AUTO LOAD + REALTIME REFRESH
  useEffect(() => {
    fetchApplications();

    // optional realtime sync (recommended)
    const interval = setInterval(() => {
      fetchApplications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  //  NORMALIZE STATUS (IMPORTANT FIX)
  const normalizeStatus = (status) => {
    return (status || "").toLowerCase();
  };

  // Filter Logic
  const filteredApps =
    filter === "all"
      ? applications
      : applications.filter(
          (app) => normalizeStatus(app.status) === filter
        );

  //  WITHDRAW APPLICATION
  const handleWithdraw = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Application withdrawn");

      //  refresh full data
      fetchApplications();
    } catch (err) {
      console.log(err);
      toast.error("Failed to withdraw application");
    }
  };

  return (
    <Navbar>
      <div className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 min-h-screen w-full">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <h1 className="text-4xl font-semibold text-purple-300 mb-10 flex items-center gap-3">
            <FaClipboardList /> My Applications
          </h1>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/90 p-5 rounded-xl text-center shadow-lg">
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-2xl font-bold text-purple-700">
                {applications.length}
              </p>
            </div>

            <div className="bg-white/90 p-5 rounded-xl text-center shadow-lg">
              <p className="text-gray-500 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-green-600">
                {applications.filter(
                  (a) => normalizeStatus(a.status) === "accepted"
                ).length}
              </p>
            </div>

            <div className="bg-white/90 p-5 rounded-xl text-center shadow-lg">
              <p className="text-gray-500 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-500">
                {applications.filter(
                  (a) => normalizeStatus(a.status) === "rejected"
                ).length}
              </p>
            </div>
          </div>

          {/* FILTER */}
          <div className="flex gap-3 mb-6">
            {["all", "pending", "accepted", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize transition ${
                  filter === f
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* APPLICATION LIST */}
          {filteredApps.length === 0 ? (
            <div className="text-center text-white">
              <p className="text-lg">No applications found</p>
              <button
                onClick={() => navigate("/jobs")}
                className="mt-3 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredApps.map((app) => {
                const status = normalizeStatus(app.status);

                return (
                  <div
                    key={app._id}
                    className="bg-white/95 p-6 rounded-2xl shadow-lg border hover:shadow-2xl transition"
                  >
                    {/* TITLE */}
                    <h2 className="text-xl font-bold text-purple-800 mb-2 flex items-center gap-2">
                      <FaBriefcase /> {app.job?.title}
                    </h2>

                    {/* LOCATION */}
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <FaMapMarkerAlt /> {app.job?.location}
                    </p>

                    {/* SALARY */}
                    <p className="text-gray-700 text-sm mt-1 flex items-center gap-2">
                      <FaRupeeSign /> {app.job?.salaryMin} -{" "}
                      {app.job?.salaryMax}
                    </p>

                    {/* DATE */}
                    <p className="text-xs text-gray-500 mt-2">
                      Applied on:{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>

                    {/* STATUS (FIXED) */}
                    <p className="mt-3">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          status === "accepted"
                            ? "text-green-600"
                            : status === "rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {status}
                      </span>
                    </p>

                    {/* ACTION */}
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="mt-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <FaTrash /> Withdraw
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default Dashboard;