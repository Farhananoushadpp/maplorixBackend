import React, { useState, useEffect } from 'react';
import { jobsAPI } from './api';

const PostsFeedFixed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getAllJobs();
      const jobsData = response.data?.jobs || response.data || [];
      
      console.log("📋 PostsFeedFixed: Raw jobs data:", jobsData);
      console.log("📋 PostsFeedFixed: Job count:", jobsData.length);
      
      // Log sample job structure to understand the data
      if (jobsData.length > 0) {
        console.log("📋 PostsFeedFixed: Sample job structure:", jobsData[0]);
      }
      
      // Filter logic - SHOW ALL JOBS (both admin and regular)
      // The issue was that admin jobs were being filtered out
      const filteredJobs = jobsData.filter(job => {
        // Only filter out jobs that are explicitly inactive or deleted
        // Don't filter based on postedBy - show all active jobs
        return job.status === 'active' || !job.status; // Show active jobs or jobs without status
      });
      
      console.log("📋 PostsFeedFixed: Filtered jobs:", filteredJobs.length);
      console.log("📋 PostsFeedFixed: Jobs to display:", filteredJobs);
      
      setJobs(filteredJobs);
    } catch (error) {
      console.error('❌ PostsFeedFixed: Failed to fetch jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("📋 PostsFeedFixed: Auto-refreshing feed...");
      fetchJobs();
      console.log("📋 PostsFeedFixed: Auto-refresh completed");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatSalary = (salary) => {
    if (!salary || typeof salary !== 'object') {
      return 'Not specified';
    }
    
    const { min, max, currency = 'USD' } = salary;
    
    if (min && max) {
      return `${currency} ${min} - ${max}`;
    } else if (min) {
      return `${currency} ${min}+`;
    } else if (max) {
      return `Up to ${currency} ${max}`;
    }
    
    return 'Not specified';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Not specified';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No jobs available at the moment.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Job Feed</h2>
        <div className="text-sm text-gray-500">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.map((job, index) => (
          <div key={job._id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title || 'Untitled Position'}</h3>
                <div className="text-gray-600 mb-2">
                  {job.company || 'Company'} • {job.location || 'Location not specified'}
                </div>
                <div className="text-sm text-gray-500">
                  Posted: {formatDate(job.createdAt)}
                  {job.postedBy && ` • Posted by: ${job.postedBy}`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">
                  {formatSalary(job.salary)}
                </div>
                <div className="text-sm text-gray-500">
                  {job.type || 'Full-time'}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-gray-700 mb-2">
                <strong>Experience:</strong> {job.experience || 'Not specified'}
              </div>
              <div className="text-gray-700">
                <strong>Description:</strong> {job.description ? 
                  (job.description.length > 200 ? 
                    `${job.description.substring(0, 200)}...` : 
                    job.description) : 
                  'No description available'
                }
              </div>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-4">
                <strong className="text-gray-700">Requirements:</strong>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  {job.requirements.slice(0, 3).map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                  {job.requirements.length > 3 && (
                    <li className="text-gray-500">...and {job.requirements.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {job.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {job.category}
                  </span>
                )}
                {job.department && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {job.department}
                  </span>
                )}
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsFeedFixed;
