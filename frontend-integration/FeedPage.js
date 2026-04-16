import React, { useState, useEffect } from 'react';
import { jobsAPI, applicationsAPI } from './api';

const FeedPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    jobRole: '',
    experience: 'Entry Level',
    skills: '',
    currentCompany: '',
    currentDesignation: '',
    expectedSalary: { min: '', max: '', currency: 'USD' },
    noticePeriod: '30 days',
    coverLetter: '',
    linkedinProfile: '',
    portfolio: '',
    github: '',
    website: '',
    source: 'website'
  });
  const [resumeFile, setResumeFile] = useState(null);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAllJobs();
      setJobs(response.data || response);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      alert('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplyForm(true);
    setApplicationData({
      ...applicationData,
      jobRole: job.title,
      job: job._id
    });
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      await applicationsAPI.submitApplication(applicationData, resumeFile);
      
      alert('Application submitted successfully!');
      
      // Reset form
      setApplicationData({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        jobRole: '',
        experience: 'Entry Level',
        skills: '',
        currentCompany: '',
        currentDesignation: '',
        expectedSalary: { min: '', max: '', currency: 'USD' },
        noticePeriod: '30 days',
        coverLetter: '',
        linkedinProfile: '',
        portfolio: '',
        github: '',
        website: '',
        source: 'website'
      });
      setResumeFile(null);
      setShowApplyForm(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setApplicationData({
        ...applicationData,
        [parent]: {
          ...applicationData[parent],
          [child]: value
        }
      });
    } else {
      setApplicationData({
        ...applicationData,
        [name]: value
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size cannot exceed 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, DOC, and DOCX files are allowed');
        return;
      }
      
      setResumeFile(file);
    }
  };

  if (showApplyForm && selectedJob) {
    return (
      <div className="apply-form-container">
        <div className="apply-form">
          <h2>Apply for: {selectedJob.title}</h2>
          <p><strong>Company:</strong> {selectedJob.company}</p>
          <p><strong>Location:</strong> {selectedJob.location}</p>
          
          <form onSubmit={handleApplicationSubmit}>
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  value={applicationData.fullName}
                  onChange={handleApplicationChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={applicationData.email}
                  onChange={handleApplicationChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone*</label>
                <input
                  type="tel"
                  name="phone"
                  value={applicationData.phone}
                  onChange={handleApplicationChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location*</label>
                <input
                  type="text"
                  name="location"
                  value={applicationData.location}
                  onChange={handleApplicationChange}
                  required
                />
              </div>
            </div>

            <h3>Professional Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Job Role*</label>
                <input
                  type="text"
                  name="jobRole"
                  value={applicationData.jobRole}
                  onChange={handleApplicationChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Experience Level*</label>
                <select name="experience" value={applicationData.experience} onChange={handleApplicationChange}>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Executive">Executive</option>
                  <option value="Fresher">Fresher</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Skills</label>
              <textarea
                name="skills"
                value={applicationData.skills}
                onChange={handleApplicationChange}
                placeholder="e.g., JavaScript, React, Node.js, MongoDB"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Current Company</label>
                <input
                  type="text"
                  name="currentCompany"
                  value={applicationData.currentCompany}
                  onChange={handleApplicationChange}
                />
              </div>
              <div className="form-group">
                <label>Current Designation</label>
                <input
                  type="text"
                  name="currentDesignation"
                  value={applicationData.currentDesignation}
                  onChange={handleApplicationChange}
                />
              </div>
            </div>

            <h3>Salary Expectations</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Expected Min Salary</label>
                <input
                  type="number"
                  name="expectedSalary.min"
                  value={applicationData.expectedSalary.min}
                  onChange={handleApplicationChange}
                />
              </div>
              <div className="form-group">
                <label>Expected Max Salary</label>
                <input
                  type="number"
                  name="expectedSalary.max"
                  value={applicationData.expectedSalary.max}
                  onChange={handleApplicationChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Resume*</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
              {resumeFile && <p>Selected: {resumeFile.name}</p>}
            </div>

            <div className="form-group">
              <label>Cover Letter</label>
              <textarea
                name="coverLetter"
                value={applicationData.coverLetter}
                onChange={handleApplicationChange}
                rows="4"
                placeholder="Tell us why you're interested in this position..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <button type="button" onClick={() => {
                setShowApplyForm(false);
                setSelectedJob(null);
                setResumeFile(null);
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <h1>Job Opportunities</h1>
      
      {loading && <p>Loading jobs...</p>}
      
      <div className="jobs-grid">
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p className="company">{job.company}</p>
            <p className="location">📍 {job.location}</p>
            <p className="type">💼 {job.type}</p>
            <p className="experience">📊 {job.experience}</p>
            
            {job.salary?.min && (
              <p className="salary">💰 ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString() || 'Negotiable'}</p>
            )}
            
            {job.description && (
              <p className="description">{job.description.substring(0, 150)}...</p>
            )}
            
            <div className="job-footer">
              <span className="posted-date">
                Posted: {new Date(job.postedDate).toLocaleDateString()}
              </span>
              <button 
                className="apply-btn"
                onClick={() => handleApplyClick(job)}
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {jobs.length === 0 && !loading && (
        <p>No job openings available at the moment.</p>
      )}
    </div>
  );
};

export default FeedPage;
