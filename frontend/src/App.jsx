import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PostJobForm from "../components/PostJobForm";
import FeedPage from "../pages/FeedPage";
import AdminPostsPage from "../pages/AdminPostsPage";
import AdminDashboard from "../pages/AdminDashboard";
import JobDetailsPage from "../pages/JobDetailsPage";

const App = () => {
  // Check if user is logged in
  const isAuthenticated = () => {
    return localStorage.getItem("token") && localStorage.getItem("user");
  };

  // Check if user is admin
  const isAdmin = () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return false;
      const user = JSON.parse(userData);
      return user.role === "admin";
    } catch (error) {
      return false;
    }
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<FeedPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/job/:jobId" element={<JobDetailsPage />} />

          {/* Protected Routes */}
          <Route
            path="/post-job"
            element={
              isAuthenticated() ? <PostJobForm /> : <Navigate to="/login" />
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/admin/dashboard"
            element={
              isAuthenticated() && isAdmin() ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/posts"
            element={
              isAuthenticated() && isAdmin() ? (
                <AdminPostsPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
