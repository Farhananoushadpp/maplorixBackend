import React from 'react';
import { formatSalary, formatDate, formatText } from './utils';

const ApplicationDetails = ({ application }) => {
  return (
    <div className="application-details">
      <div className="detail-section">
        <h3>Personal Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Full Name:</label>
            <span>{formatText(application.fullName)}</span>
          </div>
          <div className="detail-item">
            <label>Email:</label>
            <span>{formatText(application.email)}</span>
          </div>
          <div className="detail-item">
            <label>Phone:</label>
            <span>{formatText(application.phone)}</span>
          </div>
          <div className="detail-item">
            <label>Location:</label>
            <span>{formatText(application.location)}</span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Professional Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Job Role:</label>
            <span>{formatText(application.jobRole)}</span>
          </div>
          <div className="detail-item">
            <label>Experience Level:</label>
            <span>{formatText(application.experience)}</span>
          </div>
          <div className="detail-item">
            <label>Current Company:</label>
            <span>{formatText(application.currentCompany)}</span>
          </div>
          <div className="detail-item">
            <label>Current Designation:</label>
            <span>{formatText(application.currentDesignation)}</span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Salary Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Expected Salary:</label>
            <span>{formatSalary(application.expectedSalary)}</span>
          </div>
          <div className="detail-item">
            <label>Salary Negotiable:</label>
            <span>{application.salaryNegotiable ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Additional Information</h3>
        <div className="detail-grid">
          <div className="detail-item full-width">
            <label>Cover Letter:</label>
            <span>{formatText(application.coverLetter)}</span>
          </div>
          <div className="detail-item">
            <label>Status:</label>
            <span className={`status-badge ${application.status}`}>
              {application.status.replace('-', ' ')}
            </span>
          </div>
          <div className="detail-item">
            <label>Submitted Date:</label>
            <span>{formatDate(application.createdAt)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .application-details {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
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
      `}</style>
    </div>
  );
};

export default ApplicationDetails;
