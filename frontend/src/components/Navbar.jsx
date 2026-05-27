import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import {
  FaUserCircle,
  FaBriefcase,
  FaClipboardList,
  FaUser,
  FaBars,
  FaPlusCircle,
} from "react-icons/fa";
import { UserContext } from "../context/UserContext";

export default function Navbar({ children, setIsEditing }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [keyword, setKeyword] = useState("");


  const role = localStorage.getItem("role");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const activeLink = (path) =>
    location.pathname === path
      ? "bg-purple-600 text-white font-semibold shadow-lg"
      : "text-gray-300 hover:bg-white/10 hover:text-white";

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed md:sticky md:top-0 z-40 h-screen w-64
        bg-gradient-to-b from-gray-950 via-purple-900 to-black
        text-white flex flex-col shadow-2xl transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300`}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold p-6 border-b border-white/10 cursor-pointer tracking-wide"
        >
          {
            <h1 className="text-xl font-bold tracking-wide cursor-pointer">
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent font-extrabold">
                Nexaris
              </span>
            </h1>
          }
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2 p-4">
          <button
            onClick={() => {
              if (role === "job_seeker") {
                navigate("/dashboard");
              } else if (role === "employer") {
                navigate("/employer-dashboard");
              }
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 ${activeLink(
              role === "job_seeker"
                ? "/dashboard"
                : "/employer-dashboard"
            )}`}
          >
            <FaUserCircle />
            Dashboard
          </button>
          <button
            onClick={() => {
              navigate("/jobs");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 ${activeLink(
              "/jobs"
            )}`}
          >
            <FaBriefcase />
            Jobs
          </button>

          {role === "employer" && (
            <button
              onClick={() => {
                navigate("/post-job");
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 ${activeLink(
                "/post-job"
              )}`}
            >
              <FaPlusCircle />
              Post Job
            </button>
          )}

          <button
            onClick={() => {
              if (role === "job_seeker") {
                navigate("/my-applications");
              } else if (role === "employer") {
                navigate("/employer-applications");
              }

              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 ${activeLink(
              role === "job_seeker"
                ? "/my-applications"
                : "/employer-applications"
            )}`}
          >
            <FaClipboardList />
            Applications
          </button>

          <button
            onClick={() => {
              setOpen(false);
              if (role === "employer") {
                navigate("/employer-profile");
              } else {
                navigate("/profile");
              }
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 ${
              location.pathname.includes("profile")
                ? "bg-purple-600 text-white font-semibold"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FaUser />
            Profile
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 bg-gray-900 min-h-screen">
        {/* Header */}
        <div
          className="fixed top-0 left-0 md:left-64 right-0
        flex items-center justify-between p-4
        backdrop-blur-md bg-black/60 border-b border-white/10 shadow z-40"
        >
          {/* Hamburger */}
          <div className="w-6 flex items-center">
            <FaBars
              className="text-xl cursor-pointer md:hidden text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>

          {/* Profile */}
          <div className="relative">
            <div
              onClick={() => setOpen(!open)}
              className="cursor-pointer flex items-center justify-center"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover
                  ring-2 ring-purple-500 hover:ring-purple-400 transition"
                />
              ) : (
                <FaUserCircle size={34} className="text-white" />
              )}
            </div>

            {open && (
              <div
                className="absolute right-0 mt-3 w-44
              bg-gray-900 text-white
              shadow-xl rounded-xl border border-white/10"
              >
                <button
                  onClick={() => {
                    if (role === "employer") {
                      navigate("/employer-profile", { state: { edit: true } }); // pass edit mode
                    } else {
                      navigate("/profile", { state: { edit: true } });
                      if (setIsEditing) setIsEditing(true);
                    }
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10 rounded-t-xl"
                >
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10 text-red-400 rounded-b-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-20 p-6">{children}</div>
      </div>
    </div>
  );
}
