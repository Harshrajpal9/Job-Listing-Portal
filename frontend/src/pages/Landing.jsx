import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";

import {
  FaSignInAlt,
  FaUserPlus,
  FaBriefcase,
  FaSignOutAlt,
  FaRocket,
  FaSearch,
  FaBuilding,
  FaBolt,
} from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  return (
    <div className="bg-gradient-to-br from-black via-purple-900 to-gray-900 text-white min-h-screen">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4">
        <h1 className="text-xl font-bold tracking-wide cursor-pointer">
          <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent font-extrabold">
            Nexaris
          </span>
        </h1>

        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <span className="text-gray-300 hidden sm:block">
                Hi, {user.name || "User"}
              </span>

              <button
                onClick={() => navigate("/jobs")}
                className="flex items-center gap-2 hover:text-gray-300"
              >
                <FaBriefcase />
                Dashboard
              </button>

              <button
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully");
                  navigate("/");
                }}
                className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 hover:text-gray-300"
              >
                <FaSignInAlt />
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-700 shadow-md"
              >
                <FaUserPlus />
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center px-6 py-20">
        <h1 className="text-5xl font-bold leading-tight">
          Find Your Dream Job <br />
          <span className="text-purple-400">Faster & Smarter</span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          Connect with top companies, explore opportunities, and hire the best
          talent — all in one place.
        </p>

        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 bg-purple-600 px-6 py-3 rounded-full hover:bg-purple-700 shadow-lg shadow-purple-500/30"
          >
            <FaRocket />
            Get Started
          </button>

          <button
            onClick={() => {
              if (user) {
                navigate("/jobs");
              } else {
                navigate("/login");
              }
            }}
            className="inline-flex items-center gap-2 border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
          >
            <FaBriefcase />
            Browse Jobs
          </button>
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className="text-center py-20 px-6 bg-black/40 backdrop-blur-lg border-y border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10 blur-2xl"></div>

        <h2 className="text-4xl font-bold mb-4 relative">
          Everything You Need to{" "}
          <span className="text-purple-400">Succeed</span>
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto text-lg relative">
          Whether you're looking for your next opportunity or the perfect
          candidate, we have the tools and features to make it happen.
        </p>
      </section>

      {/* FEATURES */}
      <section className="px-8 py-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <FaSearch className="text-blue-400 text-2xl mb-3" />
          <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
          <p className="text-gray-300">
            AI-powered job matching tailored to your skills.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <FaBuilding className="text-green-400 text-2xl mb-3" />
          <h3 className="text-xl font-semibold mb-2">Employer Tools</h3>
          <p className="text-gray-300">
            Post jobs, manage candidates, and streamline hiring.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <FaBolt className="text-yellow-400 text-2xl mb-3" />
          <h3 className="text-xl font-semibold mb-2">Fast Hiring</h3>
          <p className="text-gray-300">
            Reduce hiring time with efficient workflows.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[1, 2, 3].map((step, index) => (
            <div key={index} className="text-center">
              {/* Number Circle */}
              <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-full bg-purple-600/20 border border-purple-500 text-purple-400 text-xl font-bold shadow-md">
                {step}
              </div>

              {/* Title */}
              <h4 className="text-xl font-semibold mb-2">
                {step === 1 && "Create Account"}
                {step === 2 && "Explore Jobs"}
                {step === 3 && "Get Hired"}
              </h4>

              {/* Description */}
              <p className="text-gray-300 text-base leading-relaxed max-w-xs mx-auto">
                {step === 1 &&
                  "Sign up as a job seeker or employer in just a few clicks."}
                {step === 2 &&
                  "Browse jobs or post opportunities tailored to your needs."}
                {step === 3 &&
                  "Connect with the right people and land your dream job."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* */}
      <section className="text-center py-20 bg-black/40 backdrop-blur-lg border-t border-white/10">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          Start Your Journey Today
          <FaRocket className="text-white " />
        </h2>
        <p className="mb-6 text-gray-300">
          Join thousands of job seekers and employers.
        </p>
        <button
          onClick={() => {
            if (user) {
              navigate("/jobs");
            } else {
              navigate("/register");
            }
          }}
          className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition"
        >
          <FaRocket />
          Join Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-400 text-sm">
        © 2026 JobPortal. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
