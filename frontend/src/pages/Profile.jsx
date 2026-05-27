import { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    education: "",
    bio: "",
    skills: "",
    resume: null,
    avatar: null,
    avatarPreview: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  // Fetch or sync profile data – runs once on mount
  useEffect(() => {
    const loadProfile = async () => {
      // 1. Prefer data already in context (fastest)
      if (user && user.email) {
        const avatarUrl = user.avatar || null;

        setProfile({
          name: user.name || "",
          email: user.contactEmail || user.email || "",
          phone: user.phone || "",
          location: user.location || "",
          education: user.education || "",
          bio: user.bio || "",
          skills: user.skills || "",
          resume: null,
          avatar: null,
          avatarPreview: avatarUrl,
        });

        setProfileExists(!!user._id);
        setIsEditing(false);
        return;
      }

      // 2. Fallback: fetch from backend
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setIsEditing(true);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/jobseeker/${email}`);
        if (res.data) {
          const data = res.data;
          const avatarUrl = data.avatar
            ? `http://localhost:5000/uploads/avatars/${
                data.avatar
              }?t=${Date.now()}`
            : null;

          setProfile({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            education: data.education || "",
            bio: data.bio || "",
            skills: data.skills || "",
            resume: null,
            avatar: null,
            avatarPreview: avatarUrl,
          });

          setProfileExists(true);
          setIsEditing(false);

          // Update context so future renders can use it
          setUser({
            ...data,
            avatar: avatarUrl,
          });
        } else {
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setIsEditing(true);
      }
    };

    loadProfile();
  }, []); // only on mount

  // When entering edit mode → make sure form is up-to-date from context
  useEffect(() => {
    if (isEditing && user?.email) {
      setProfile({
        name: user.name || "",
        email: user.contactEmail || user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        education: user.education || "",
        bio: user.bio || "",
        skills: user.skills || "",
        resume: null,
        avatar: null,
        avatarPreview: user.avatar || null,
      });
    }
  }, [isEditing, user]);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      if (profile.avatarPreview && profile.avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(profile.avatarPreview);
      }
    };
  }, [profile.avatarPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setProfile({ ...profile, phone: digitsOnly.slice(0, 10) });
      return;
    }

    setProfile({ ...profile, [name]: value });
  };

  const handleResumeUpload = (e) => {
    if (!isEditing) return;
    setProfile({ ...profile, resume: e.target.files[0] });
  };

  const handleAvatarUpload = (e) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (profile.avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(profile.avatarPreview);
    }

    const imageUrl = URL.createObjectURL(file);
    setProfile({ ...profile, avatar: file, avatarPreview: imageUrl });
  };

  const handleRemoveAvatar = () => {
    if (!isEditing) return;
    setProfile({ ...profile, avatar: null, avatarPreview: null });
    toast.success("Profile photo removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !profile.name ||
      !profile.email ||
      !profile.phone ||
      !profile.location
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    const loginEmail = localStorage.getItem("userEmail");
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", loginEmail);

    // Only send if different
    if (profile.email && profile.email !== loginEmail) {
      formData.append("contactEmail", profile.email);
    }

    formData.append("phone", profile.phone);
    formData.append("location", profile.location);
    formData.append("education", profile.education || "");
    formData.append("bio", profile.bio || "");
    formData.append("skills", profile.skills || "");

    if (profile.resume instanceof File) {
      formData.append("resume", profile.resume);
    }
    if (profile.avatar instanceof File) {
      formData.append("avatar", profile.avatar);
    }

    try {
      let savedData;

      if (profileExists && user?._id) {
        // Update
        const res = await axios.put(
          `http://localhost:5000/jobseeker/update/${user._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        savedData = res.data;
      } else {
        // Create
        const res = await axios.post(
          "http://localhost:5000/jobseeker/create",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        savedData = res.data.jobSeeker;
      }

      const avatarUrl = savedData.avatar
        ? `http://localhost:5000/uploads/avatars/${
            savedData.avatar
          }?t=${Date.now()}`
        : null;

      // Update local form state
      setProfile((prev) => ({
        ...prev,
        resume: null,
        avatar: null,
        avatarPreview: avatarUrl,
      }));

      // Update global user context
      setUser({
        ...savedData,
        avatar: avatarUrl,
      });

      setProfileExists(true);
      setIsEditing(false);

      toast.success("Profile saved successfully");
    } catch (err) {
      console.error("Profile save error:", err);
      toast.error("Error saving profile");
    }
  };

  return (
    <Navbar setIsEditing={setIsEditing}>
      <div className="p-6 md:p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 min-h-screen w-full">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-semibold text-purple-300 mb-10">
            Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Photo */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">
                Profile Photo
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden ring-2 ring-purple-400">
                  {profile.avatarPreview && (
                    <img
                      src={profile.avatarPreview}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="text-sm"
                    disabled={!isEditing}
                  />
                  {profile.avatarPreview && isEditing && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-6 text-purple-600">
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Contact Email Address"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  maxLength={10}
                  className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-4 text-purple-600">
                Education
              </h2>
              <input
                type="text"
                name="education"
                placeholder="e.g. B.Tech in Computer Science"
                value={profile.education}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Bio */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-4 text-purple-600">
                Professional Summary
              </h2>
              <textarea
                name="bio"
                rows="4"
                placeholder="Write a short professional summary..."
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Skills */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-4 text-purple-600">
                Skills
              </h2>
              <input
                type="text"
                name="skills"
                placeholder="Example: React, Node.js, UI Design"
                value={profile.skills}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Resume */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-4 text-purple-600">
                Resume Upload
              </h2>
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center">
                <p className="text-gray-500 mb-2 text-sm">
                  Upload your resume (PDF / DOC)
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={!isEditing}
                  className="block mx-auto text-sm"
                />
                {profile.resume && isEditing && (
                  <p className="text-green-600 mt-3 text-sm">
                    Uploaded: {profile.resume.name}
                  </p>
                )}
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
}
