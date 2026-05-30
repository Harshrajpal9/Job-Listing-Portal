import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_URL from "../config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load instantly from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  // Fetch fresh data from backend
  const fetchUser = useCallback(async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const role = localStorage.getItem("role");
      let res, data;

      if (role === "employer") {
        // Employer API returns { success, data }
        res = await axios.get(`${API_URL}/api/employers/${email}`);
        data = res.data.data || {}; // <-- important: use .data for employer
      } else {
        // JobSeeker API returns user object directly
        res = await axios.get(`${API_URL}/jobseeker/${email}`);
        data = res.data || {};
      }

      // Handle avatar URL
      const avatarUrl = data.avatar
        ? data.avatar.startsWith("http")
          ? data.avatar
          : `${API_URL}/uploads/avatars/${data.avatar}`
        : null;

      const updatedUser = { ...data, avatar: avatarUrl };

      // Update state and localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

   const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser,logout  }}>
      {children}
    </UserContext.Provider>
  );
};