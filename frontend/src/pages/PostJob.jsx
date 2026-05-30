import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBriefcase, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import API_URL from "../config";

export default function PostJob() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    qualifications: "",
    responsibilities: "",
    salaryMin: "",
    salaryMax: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.category ||
      !form.jobType ||
      !form.description ||
      !form.responsibilities ||
      !form.salaryMin ||
      !form.salaryMax
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (isEdit) {
        const token = localStorage.getItem("token");

        await axios.put(`${API_URL}/api/jobs/${id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Job updated successfully!");
      } else {
        const token = localStorage.getItem("token");

        await axios.post(`${API_URL}/api/jobs`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Job published successfully!");
      }

      setForm({
        title: "",
        location: "",
        category: "",
        jobType: "",
        description: "",
        qualifications: "",
        responsibilities: "",
        salaryMin: "",
        salaryMax: "",
      });

      navigate("/jobs");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      try {
        const res = await axios.get(`${API_URL}/api/jobs/${id}`);
        setForm(res.data);
      } catch (err) {
        toast.error("Failed to load job");
      }
    };

    fetchJob();
  }, [id]);
  return (
    <Navbar>
      <div className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 min-h-screen w-full">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-semibold text-purple-300 mb-10">
            Post a New Job
          </h1>

          <div className="space-y-8">
            {/* Job Basic Info */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-purple-600">
                Job Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Job Title"
                  name="title"
                  value={form.title}
                  className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 outline-none"
                  onChange={handleChange}
                />

                <input
                  type="text"
                  placeholder="Location"
                  name="location"
                  value={form.location}
                  className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 outline-none"
                  onChange={handleChange}
                />

                <select
                  className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option>IT & Software</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>Finance</option>
                  <option>Human Resources (HR)</option>
                  <option>Customer Support</option>
                  <option>Operations</option>
                  <option>Healthcare</option>
                </select>

                <select
                  className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500"
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                >
                  <option value="">Job Type</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Remote</option>
                </select>

                <select
                  className="border p-3 rounded-lg w-full md:col-span-2 focus:ring-2 focus:ring-purple-500"
                  name="qualifications"
                  value={form.qualifications}
                  onChange={handleChange}
                >
                  <option value="">Select Qualifications</option>
                  <option>B.Tech / BE</option>
                  <option>MCA</option>
                  <option>BCA</option>
                  <option>Any Graduate</option>
                  <option>Diploma</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-purple-600">
                Job Description
              </h2>

              <textarea
                rows="4"
                placeholder="Describe the job..."
                name="description"
                value={form.description}
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Responsibilities */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-purple-600">
                Responsibilities
              </h2>

              <textarea
                rows="4"
                placeholder="List responsibilities..."
                name="responsibilities"
                value={form.responsibilities}
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                onChange={handleChange}
              />
            </div>

            {/* Salary */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-700">
              <h2 className="text-xl font-semibold mb-6 text-purple-600">
                Salary Range
              </h2>

              <div className="grid grid-cols-2 gap-6">
                {/* Min Salary */}
                <div className="flex items-center border rounded-lg px-3">
                  <span className="text-gray-500 mr-2">₹</span>
                  <input
                    type="number"
                    name="salaryMin"
                    value={form.salaryMin}
                    onChange={handleChange}
                    placeholder="Minimum Salary"
                    className="w-full py-3 outline-none"
                    required
                  />
                </div>

                {/* Max Salary */}
                <div className="flex items-center border rounded-lg px-3">
                  <span className="text-gray-500 mr-2">₹</span>
                  <input
                    type="number"
                    name="salaryMax"
                    value={form.salaryMax}
                    onChange={handleChange}
                    placeholder="Maximum Salary"
                    className="w-full py-3 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow-md transition flex items-center gap-2"
              >
                <FaPaperPlane />
                Publish Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}
