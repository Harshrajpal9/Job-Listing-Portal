import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import EmployerProfile from "./pages/EmployerProfile";
import { UserProvider } from "./context/UserContext";
import Landing from "./pages/Landing";
import PostJob from "./pages/PostJob";
import ProtectedRoute from "./components/ProtectedRoute";
import Applications from "./pages/Applications";
import EmployerApplications from "./pages/EmployerApplications";
import Dashboard from "./pages/Dashboard";
import EmployerDashboard from "./pages/EmployerDashboard";



function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/jobs" element={<Jobs />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["job_seeker"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/* Job Seeker */}
          <Route path="/my-applications" element={<Applications />} />
          {/* Employer */}
          <Route path="/employer-applications" element={<EmployerApplications />} />

          <Route
            path="/employer-profile"
            element={
              <ProtectedRoute allowedRoles={["employer"]}>
                <EmployerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute allowedRoles={["employer"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job/:id"
            element={
              <ProtectedRoute allowedRoles={["employer"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["job_seeker"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["employer"]}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;