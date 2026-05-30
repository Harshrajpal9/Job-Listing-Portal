import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaUser,
  FaClipboardList,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaTools,
  FaFileDownload,
} from "react-icons/fa";
import API_URL from "../config";

export default function EmployerApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await axios.get(
        `${API_URL}/api/applications/employer`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApps(res.data);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/applications/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Application ${status}`);
      fetchApps();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <Navbar>
      <div className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 min-h-screen text-white">
        <h1 className="text-4xl font-semibold text-purple-300 mb-8 text-center md:text-left">
          Applications
        </h1>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : apps.length === 0 ? (
          <p className="text-center text-lg">No applications yet</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div
                key={app._id}
                className="bg-white text-black p-5 rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2">
                  <FaClipboardList /> {app.jobTitle || "No Title"}
                </h2>

                <p className="flex items-center gap-2 mt-2">
                  <FaUser className="text-gray-600" />{" "}
                  {app.applicantName || "Unknown"}
                </p>

                <p className="flex items-center gap-2 text-gray-600 mt-1">
                  <FaEnvelope /> {app.applicantEmail || "N/A"}
                </p>

                <button
                  onClick={() => {
                    if (!app.applicantProfile) {
                      toast.error("Profile not available");
                      return;
                    }
                    setSelectedProfile(app.applicantProfile);
                  }}
                  className="mt-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 inline-block"
                >
                  {" "}
                  View Profile
                </button>
                <p className="mt-3">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      app.status === "Accepted"
                        ? "text-green-600"
                        : app.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => updateStatus(app._id, "Accepted")}
                    disabled={app.status === "Accepted"}
                    className={`w-1/2 py-2 rounded font-semibold ${
                      app.status === "Accepted"
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "Rejected")}
                    disabled={app.status === "Rejected"}
                    className={`w-1/2 py-2 rounded font-semibold ${
                      app.status === "Rejected"
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProfile && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="w-[420px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white animate-fadeIn">
              {/* HEADER */}
              <div className="p-5 border-b border-purple-500/20 relative">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-3 right-4 text-lg font-bold text-gray-300 hover:text-white"
                >
                  ✖
                </button>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-3 rounded-full text-white">
                    <FaUser />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedProfile.name ||
                        selectedProfile.email ||
                        "No Name"}
                    </h2>

                    <p className="text-sm text-gray-300 flex items-center gap-1">
                      <FaEnvelope />
                      {selectedProfile.contactEmail ||
                        selectedProfile.email ||
                        "No Email"}
                    </p>
                  </div>
                </div>
              </div>

              {/* BODY */}
              {/* BODY */}
              <div className="p-5 space-y-4 text-sm">
                {/* PHONE */}
                <div className="flex items-start gap-2 text-gray-300">
                  <FaPhone className="text-purple-400 text-lg min-w-[20px]" />
                  <p>
                    <span className="text-purple-300 font-semibold">
                      Phone:
                    </span>{" "}
                    {selectedProfile.phone || "N/A"}
                  </p>
                </div>

                {/* LOCATION */}
                <div className="flex items-start gap-2 text-gray-300">
                  <FaMapMarkerAlt className="text-purple-400 text-lg min-w-[20px]" />
                  <p>
                    <span className="text-purple-300 font-semibold">
                      Location:
                    </span>{" "}
                    {selectedProfile.location || "N/A"}
                  </p>
                </div>

                {/* EDUCATION */}
                <div className="flex items-start gap-2 text-gray-300">
                  <FaGraduationCap className="text-purple-400 text-lg min-w-[20px]" />
                  <p>
                    <span className="text-purple-300 font-semibold">
                      Education:
                    </span>{" "}
                    {selectedProfile.education || "N/A"}
                  </p>
                </div>

                {/* SKILLS */}
                <div className="flex items-start gap-2 text-gray-300">
                  <FaTools className="text-purple-400 text-lg min-w-[20px]" />
                  <p className="break-words">
                    <span className="text-purple-300 font-semibold">
                      Skills:
                    </span>{" "}
                    {selectedProfile.skills || "N/A"}
                  </p>
                </div>

                {/* BIO */}
                <div className="flex items-start gap-2 text-gray-300">
                  <FaUser className="text-purple-400 text-lg min-w-[20px]" />
                  <p className="break-words">
                    <span className="text-purple-300 font-semibold">Bio:</span>{" "}
                    {selectedProfile.bio || "N/A"}
                  </p>
                </div>

                {/* RESUME BUTTON */}
                {selectedProfile.resume && (
                  <a
                    href={`${API_URL}/uploads/resumes/${selectedProfile.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    <FaFileDownload />
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Navbar>
  );
}
