import React, { useState, useEffect } from 'react';
import { jobsAPI } from './api';

const AdminPostsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    experience: 'Entry Level'
  });
  const [editingJob, setEditingJob] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingJob) {
        // Update existing job
        await jobsAPI.updateJob(editingJob._id, formData);
        alert('Job updated successfully!');
      } else {
        // Create new job
        await jobsAPI.createJob(formData);
        alert('Job created successfully!');
      }
      
      // Reset form and refresh jobs
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        salaryMin: '',
        salaryMax: '',
        experience: 'Entry Level'
      });
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error('Failed to save job:', error);
      alert('Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
      salaryMin: job.salary?.min || '',
      salaryMax: job.salary?.max || '',
      experience: job.experience
    });
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        setLoading(true);
        await jobsAPI.deleteJob(jobId);
        alert('Job deleted successfully!');
        fetchJobs();
      } catch (error) {
        console.error('Failed to delete job:', error);
        alert('Failed to delete job. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-posts-page">
      <h1>{editingJob ? 'Edit Job' : 'Create New Job'}</h1>
      
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label>Job Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Company*</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location*</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Job Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="form-group">
          <label>Experience Level</label>
          <select name="experience" value={formData.experience} onChange={handleChange}>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Executive">Executive</option>
            <option value="Fresher">Fresher</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Requirements</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Min Salary</label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Max Salary</label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editingJob ? 'Update Job' : 'Create Job')}
          </button>
          {editingJob && (
            <button type="button" onClick={() => {
              setEditingJob(null);
              setFormData({
                title: '',
                company: '',
                location: '',
                type: 'Full-time',
                description: '',
                requirements: '',
                salaryMin: '',
                salaryMax: '',
                experience: 'Entry Level'
              });
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="jobs-list">
        <h2>Posted Jobs</h2>
        {loading && <p>Loading...</p>}
        
        {jobs.map(job => (
          <div key={job._id} className="job-item">
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.type}</p>
            <p><strong>Posted:</strong> {new Date(job.postedDate).toLocaleDateString()}</p>
            
            <div className="job-actions">
              <button onClick={() => handleEdit(job)}>Edit</button>
              <button onClick={() => handleDelete(job._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPostsPage;
