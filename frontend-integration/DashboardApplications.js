import React, { useState, useEffect } from "react";
import { applicationsAPI } from "./api";

// Utility function to format salary
const formatSalary = (salary) => {
  if (!salary) return "Not specified";

  if (typeof salary === "string") {
    try {
      salary = JSON.parse(salary);
    } catch (e) {
      return salary;
    }
  }

  if (typeof salary === "object" && salary !== null) {
    const { min, max, currency = "USD" } = salary;

    if (min && max) {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${formatter.format(min)}+`;
    } else if (max) {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `Up to ${formatter.format(max)}`;
    } else if (currency) {
      return currency;
    }
  }

  return "Not specified";
};

const DashboardApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState({
    status: "",
    experience: "",
    search: "",
  });

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getAllApplications();
      console.log("📋 Applications API Response:", response);

      // Handle the nested data structure from backend
      const applicationsData =
        response.data?.data?.applications ||
        response.data?.applications ||
        response.data ||
        response;
      console.log("📊 Extracted applications data:", applicationsData);

      setApplications(applicationsData);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      alert("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
    setShowDetails(false);
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const filteredApplications = applications.filter((app) => {
    if (filter.status && (app.status || "") !== filter.status) return false;
    if (filter.experience && (app.experience || "") !== filter.experience)
      return false;
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      return (
        (app.fullName || "").toLowerCase().includes(searchTerm) ||
        (app.email || "").toLowerCase().includes(searchTerm) ||
        (app.jobRole || "").toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const getStatusColor = (status) => {
    const colors = {
      submitted: "#007bff",
      "under-review": "#ffc107",
      shortlisted: "#28a745",
      "interview-scheduled": "#17a2b8",
      interviewed: "#6f42c1",
      rejected: "#dc3545",
      selected: "#28a745",
      withdrawn: "#6c757d",
    };
    return colors[status] || "#6c757d";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const downloadResume = async (applicationId) => {
    try {
      // Note: This would require authentication middleware to be implemented
      window.open(
        `http://localhost:4000/api/applications/${applicationId}/resume`,
        "_blank",
      );
    } catch (error) {
      console.error("Failed to download resume:", error);
      alert("Failed to download resume. Please try again.");
    }
  };

  return (
    <div className="dashboard-applications">
      <h2>Job Applications</h2>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under-review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview-scheduled">Interview Scheduled</option>
            <option value="interviewed">Interviewed</option>
            <option value="rejected">Rejected</option>
            <option value="selected">Selected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Experience:</label>
          <select
            name="experience"
            value={filter.experience}
            onChange={handleFilterChange}
          >
            <option value="">All Experience</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Executive">Executive</option>
            <option value="Fresher">Fresher</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
            placeholder="Search by name, email, or job role..."
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="applications-table">
        {loading ? (
          <p>Loading applications...</p>
        ) : (
          <>
            <div className="table-header">
              <span>Total Applications: {filteredApplications.length}</span>
            </div>

            {filteredApplications.length === 0 ? (
              <p>No applications found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Job Role</th>
                    <th>Experience</th>
                    <th>Expected Salary</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app._id}>
                      <td>{app.fullName || "N/A"}</td>
                      <td>{app.email || "N/A"}</td>
                      <td>{app.phone || "N/A"}</td>
                      <td>{app.jobRole || "N/A"}</td>
                      <td>{app.experience || "N/A"}</td>
                      <td>{formatSalary(app.expectedSalary)}</td>
                      <td>
                        {formatDate(
                          app.appliedDate || app.createdAt || new Date(),
                        )}
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(
                              app.status || "submitted",
                            ),
                          }}
                        >
                          {(app.status || "submitted").replace("-", " ")}
                        </span>
                      </td>
                      <td>
                        {app.resume && app.resume.filename ? (
                          <button
                            className="download-btn"
                            onClick={() => downloadResume(app._id)}
                          >
                            Download
                          </button>
                        ) : (
                          <span>No Resume</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="view-details-btn"
                          onClick={() => handleViewDetails(app)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Statistics */}
      <div className="applications-stats">
        <h3>Application Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Applications</h4>
            <p>{applications.length}</p>
          </div>
          <div className="stat-card">
            <h4>Submitted</h4>
            <p>
              {applications.filter((app) => app.status === "submitted").length}
            </p>
          </div>
          <div className="stat-card">
            <h4>Under Review</h4>
            <p>
              {
                applications.filter((app) => app.status === "under-review")
                  .length
              }
            </p>
          </div>
          <div className="stat-card">
            <h4>Shortlisted</h4>
            <p>
              {
                applications.filter((app) => app.status === "shortlisted")
                  .length
              }
            </p>
          </div>
          <div className="stat-card">
            <h4>Interview Scheduled</h4>
            <p>
              {
                applications.filter(
                  (app) => app.status === "interview-scheduled",
                ).length
              }
            </p>
          </div>
          <div className="stat-card">
            <h4>Selected</h4>
            <p>
              {applications.filter((app) => app.status === "selected").length}
            </p>
          </div>
        </div>
      </div>
      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button className="close-btn" onClick={handleCloseDetails}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Full Name:</label>
                    <span>{selectedApplication.fullName || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedApplication.email || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedApplication.phone || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{selectedApplication.location || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Professional Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Job Role:</label>
                    <span>{selectedApplication.jobRole || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Experience Level:</label>
                    <span>{selectedApplication.experience || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Current Company:</label>
                    <span>{selectedApplication.currentCompany || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Current Designation:</label>
                    <span>
                      {selectedApplication.currentDesignation || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Salary Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Expected Salary:</label>
                    <span>
                      {formatSalary(selectedApplication.expectedSalary)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Salary Negotiable:</label>
                    <span>
                      {selectedApplication.salaryNegotiable ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Additional Information</h3>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <label>Cover Letter:</label>
                    <span>
                      {selectedApplication.coverLetter || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Skills:</label>
                    <span>{selectedApplication.skills || "Not specified"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span
                      className={`status-badge ${selectedApplication.status}`}
                    >
                      {(selectedApplication.status || "submitted").replace(
                        "-",
                        " ",
                      )}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Submitted Date:</label>
                    <span>
                      {formatDate(
                        selectedApplication.appliedDate ||
                          selectedApplication.createdAt ||
                          new Date(),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardApplications;

/* Add these styles to your CSS file or use as inline styles */
const modalStyles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.detail-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.detail-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.detail-item span {
  color: #333;
  font-size: 14px;
}

.view-details-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
}

.view-details-btn:hover {
  background-color: #0056b3;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.submitted {
  background-color: #007bff;
  color: white;
}

.status-badge.under-review {
  background-color: #ffc107;
  color: #333;
}

.status-badge.shortlisted {
  background-color: #28a745;
  color: white;
}

.status-badge.interview-scheduled {
  background-color: #17a2b8;
  color: white;
}

.status-badge.interviewed {
  background-color: #6f42c1;
  color: white;
}

.status-badge.rejected {
  background-color: #dc3545;
  color: white;
}

.status-badge.selected {
  background-color: #28a745;
  color: white;
}

.status-badge.withdrawn {
  background-color: #6c757d;
  color: white;
}
`;
