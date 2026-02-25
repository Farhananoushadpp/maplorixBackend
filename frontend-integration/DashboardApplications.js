import React, { useState, useEffect } from 'react';
import { applicationsAPI } from './api';

const DashboardApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    status: '',
    experience: '',
    search: ''
  });

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getAllApplications();
      setApplications(response.data || response);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      alert('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const filteredApplications = applications.filter(app => {
    if (filter.status && app.status !== filter.status) return false;
    if (filter.experience && app.experience !== filter.experience) return false;
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      return (
        app.fullName.toLowerCase().includes(searchTerm) ||
        app.email.toLowerCase().includes(searchTerm) ||
        app.jobRole.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const getStatusColor = (status) => {
    const colors = {
      'submitted': '#007bff',
      'under-review': '#ffc107',
      'shortlisted': '#28a745',
      'interview-scheduled': '#17a2b8',
      'interviewed': '#6f42c1',
      'rejected': '#dc3545',
      'selected': '#28a745',
      'withdrawn': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const downloadResume = async (applicationId) => {
    try {
      // Note: This would require authentication middleware to be implemented
      window.open(`http://localhost:4000/api/applications/${applicationId}/resume`, '_blank');
    } catch (error) {
      console.error('Failed to download resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  return (
    <div className="dashboard-applications">
      <h2>Job Applications</h2>
      
      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select name="status" value={filter.status} onChange={handleFilterChange}>
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
          <select name="experience" value={filter.experience} onChange={handleFilterChange}>
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
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map(app => (
                    <tr key={app._id}>
                      <td>{app.fullName}</td>
                      <td>{app.email}</td>
                      <td>{app.phone}</td>
                      <td>{app.jobRole}</td>
                      <td>{app.experience}</td>
                      <td>{formatDate(app.appliedDate || app.createdAt)}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(app.status) }}
                        >
                          {app.status.replace('-', ' ')}
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
            <p>{applications.filter(app => app.status === 'submitted').length}</p>
          </div>
          <div className="stat-card">
            <h4>Under Review</h4>
            <p>{applications.filter(app => app.status === 'under-review').length}</p>
          </div>
          <div className="stat-card">
            <h4>Shortlisted</h4>
            <p>{applications.filter(app => app.status === 'shortlisted').length}</p>
          </div>
          <div className="stat-card">
            <h4>Interview Scheduled</h4>
            <p>{applications.filter(app => app.status === 'interview-scheduled').length}</p>
          </div>
          <div className="stat-card">
            <h4>Selected</h4>
            <p>{applications.filter(app => app.status === 'selected').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardApplications;
