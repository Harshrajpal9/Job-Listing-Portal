import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserTie, FaBriefcase } from "react-icons/fa";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import API_URL from "../config";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!role) {
      toast.error("Please select a role");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email: email.toLowerCase().trim(),
        password,
        role,
      });

      toast.success("Registration Successful");
      navigate("/login");
    } catch (err) {
      toast.error("Error registering user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-green-100 via-white to-blue-100 p-4 sm:p-6">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-gray-700 hover:bg-black hover:text-white transition"
        >
          <FaArrowLeft />
          Home
        </button>
      </div>
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Join our Job Portal to discover opportunities or hire the best talent.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Role Selection */}

          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Select Your Role
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {" "}
              <div
                onClick={() => setRole("job_seeker")}
                className={`border rounded-lg p-4 cursor-pointer text-center transition 
${role === "job_seeker" ? "border-green-600 bg-green-50" : "border-gray-300"}`}
              >
                <FaUserTie className="mx-auto text-xl text-green-600 mb-1" />

                <p className="text-sm font-medium">Job Seeker</p>
              </div>
              <div
                onClick={() => setRole("employer")}
                className={`border rounded-lg p-4 cursor-pointer text-center transition 
${role === "employer" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
              >
                <FaBriefcase className="mx-auto text-xl text-blue-600 mb-1" />

                <p className="text-sm font-medium">Employer</p>
              </div>
            </div>
          </div>

          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-4">
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="text-green-600 font-semibold ml-1 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
