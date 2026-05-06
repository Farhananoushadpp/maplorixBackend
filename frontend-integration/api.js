import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Jobs API
export const jobsAPI = {
  // Get all jobs
  getAllJobs: async () => {
    try {
      const response = await api.get("/jobs");
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  // Create new job
  createJob: async (jobData) => {
    try {
      const response = await api.post("/jobs", {
        ...jobData,
        postedBy: "admin", // or 'user' based on your auth
      });
      return response.data;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  },

  // Delete job
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  },
};

// Applications API
export const applicationsAPI = {
  // Submit application
  submitApplication: async (applicationData, resumeFile) => {
    try {
      const formData = new FormData();

      // Add all application fields
      Object.keys(applicationData).forEach((key) => {
        if (key !== "resume") {
          formData.append(key, applicationData[key]);
        }
      });

      // Add resume file if provided
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await api.post("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error;
    }
  },

  // Get all applications (for dashboard)
  getAllApplications: async () => {
    try {
      const response = await api.get("/applications");
      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  },
};

// Auth API
export const authAPI = {
  // Register user
  register: async (userData, recaptchaToken) => {
    try {
      const response = await api.post("/auth/register", {
        ...userData,
        recaptchaToken,
      });
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // Login user
  login: async (credentials, recaptchaToken) => {
    try {
      const response = await api.post("/auth/login", {
        ...credentials,
        recaptchaToken,
      });
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  // Get current user profile
  getProfile: async (token) => {
    try {
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (token, profileData) => {
    try {
      const response = await api.put("/auth/me", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (token, passwordData) => {
    try {
      const response = await api.post("/auth/change-password", passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post("/auth/refresh", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },
};

export default api;
