import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";

const EmployerProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();

  const [company, setCompany] = useState({
    companyName: "",
    description: "",
    website: "",
    contactEmail: "",
    location: "",
    contactPerson: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  // const [isLoaded, setIsLoaded] = useState(false);

  const email = localStorage.getItem("userEmail")?.toLowerCase().trim();

  // Fetch employer profile on mount or if navigation state changes
  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employers/${email}`);
        const data = await res.json();

        if (data.success && data.data) {
          setCompany(data.data);
          setProfileExists(true);
          setIsEditing(location.state?.edit || false);
          
          // update context with fetched employer data
          setUser((prev) => ({
            ...prev,
            ...data.data,
          }));
        } else {
          // first-time user: allow editing
          setIsEditing(true);
        }

        // setIsLoaded(true);
      } catch (err) {
        console.log("Employer profile fetch error:", err);
        toast.error("Failed to load profile");
        setIsEditing(true);
        // setIsLoaded(true);
      }
    };

    fetchProfile();
  }, [email, location.key, setUser]);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      "companyName",
      "website",
      "location",
      "description",
      "contactPerson",
      "contactEmail",
      "phone",
    ];

    for (let field of requiredFields) {
      if (!company[field]) {
        toast.error("Please fill all required fields");
        return;
      }
    }

    try {
      const method = profileExists ? "PUT" : "POST";
      const url = profileExists
        ? `http://localhost:5000/api/employers/${email}`
        : "http://localhost:5000/api/employers";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
body: JSON.stringify({
  ...company,
  email: user.email, 
})      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          profileExists
            ? "Profile updated successfully"
            : "Profile created successfully"
        );
        setIsEditing(false);
        setProfileExists(true);

        // Update context
        setUser((prev) => ({
          ...prev,
          ...company,
        }));
      } else {
        toast.error(data.message || "Error saving profile");
      }
    } catch (err) {
      console.error("Employer profile save error:", err);
      toast.error("Server error");
    }
  };

  // if (!isLoaded)
  //   return <div className="p-6 text-white">Loading employer profile...</div>;

  return (
    <Navbar>
      <div className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 min-h-screen w-full">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-semibold text-purple-300 mb-10">
            Employer Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Info */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-6 text-purple-600">
                Company Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="companyName"
                  value={company.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                  disabled={!isEditing}
                  className="border border-gray-200 p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
                <input
                  type="url"
                  name="website"
                  value={company.website}
                  onChange={handleChange}
                  placeholder="Company Website"
                  disabled={!isEditing}
                  className="border border-gray-200 p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
                <input
                  type="text"
                  name="location"
                  value={company.location}
                  onChange={handleChange}
                  placeholder="Company Location"
                  disabled={!isEditing}
                  className="border border-gray-200 p-3 w-full rounded-lg md:col-span-2 outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
                <textarea
                  rows="4"
                  name="description"
                  value={company.description}
                  onChange={handleChange}
                  placeholder="Company Description"
                  disabled={!isEditing}
                  className="border border-gray-200 p-3 w-full rounded-lg md:col-span-2 outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-6 text-purple-600">
                Contact Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="contactPerson"
                  value={company.contactPerson}
                  onChange={handleChange}
                  placeholder="Contact Person"
                  disabled={!isEditing}
                  className="border border-gray-200 p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
                <input
                  type="email"
                  name="contactEmail"
                  value={company.contactEmail}
                  onChange={handleChange}
                  placeholder="Contact Email"
                  disabled={!isEditing}
                  className="border border-gray-200 p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={company.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  maxLength={10}
                  disabled={!isEditing}
                  className="border border-gray-200 p-3 w-full rounded-lg md:col-span-2 outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow-md transition"
                >
                  Save Profile
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Navbar>
  );
};

export default EmployerProfile;