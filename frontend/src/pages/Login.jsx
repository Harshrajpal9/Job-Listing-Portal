import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import { FaArrowLeft } from "react-icons/fa";
import API_URL from "../config";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: email.toLowerCase().trim(),
        password,
      });

      const userData = res.data.user;

      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", userData.id);

   

      // role-based API

      let profileRes;
      let data = userData; // fallback if profile not found

      try {
        if (userData.role.toLowerCase() === "employer") {
          profileRes = await axios.get(
            `${API_URL}//api/employers/${userData.email}`
          );
          data = profileRes.data.data || userData; // if no profile yet, fallback
        } else {
          profileRes = await axios.get(
            `${API_URL}/jobseeker/${userData.email}`
          );
          data = profileRes.data || userData;
        }
      } catch (err) {
        console.log("Profile fetch failed, using login data only");
        data = userData;
      }

      // Prepare avatar
      const avatarUrl = data.avatar
        ? `${API_URL}/uploads/avatars/${data.avatar}`
        : null;

      const fullUser = {
        ...data,
        avatar: avatarUrl,
      };

      //  update state
      setUser(fullUser);
      localStorage.setItem("user", JSON.stringify(fullUser));

      toast.success("Login Successful");

      // optional redirect based on role
      if (userData.role === "employer") {
        navigate("/employer-profile");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-gray-700 hover:bg-black hover:text-white transition"
          >
            <FaArrowLeft />
            Home
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Login to explore job opportunities and manage your applications.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-300 transition shadow-md hover:shadow-lg">
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/register"
            className="text-green-600 font-semibold ml-1 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
