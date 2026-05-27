import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";


export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/applications/my",
        {
          headers: {
            Authorization: `Bearer ${token}`, //  JWT header
          },
        }
      );

      setApplications(res.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
      } else {
        toast.error("Failed to load applications");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    if (status === "Accepted") return "text-green-600 bg-green-100";
    if (status === "Rejected") return "text-red-600 bg-red-100";
    return "text-yellow-600 bg-yellow-100";
  };

  return (
    <Navbar>
      <div className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold text-purple-300 mb-8">
            My Applications
          </h1>

          {/*  Loading */}
          {loading ? (
            <p className="text-white text-center">Loading...</p>
          ) : applications.length === 0 ? (
            <p className="text-white text-center">No applications found</p>
          ) : (
            <div className="flex flex-col gap-6">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-md"
                >
                  {/* Job Title */}
                  <h2 className="text-xl font-semibold text-purple-800 mb-2">
                    {app.job?.title || "No Title"}
                  </h2>

                  {/* Location */}
                  <p className="text-gray-500 text-sm flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-purple-600" />
                    {app.job?.location || "Not specified"}
                  </p>

                  {/* Job Type */}
                  <p className="text-gray-600 text-sm flex items-center gap-2 mb-3">
                    <FaBriefcase className="text-purple-600" />
                    {app.job?.jobType || "N/A"}
                  </p>

                  {/* Status */}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {app.job?.description || "No description available"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
}