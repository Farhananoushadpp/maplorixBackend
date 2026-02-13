import React, { useState, useEffect } from 'react';

const FeedPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        type: '',
        experience: '',
        location: '',
        search: ''
    });

    // Fetch jobs from database
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            
            // Build query string from filters
            const queryParams = new URLSearchParams();
            
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.experience) queryParams.append('experience', filters.experience);
            if (filters.location) queryParams.append('location', filters.location);
            if (filters.search) queryParams.append('search', filters.search);
            
            const queryString = queryParams.toString();
            const url = `http://localhost:4000/api/jobs${queryString ? '?' + queryString : ''}`;
            
            console.log('Fetching jobs from:', url);
            
            const response = await fetch(url);
            const result = await response.json();
            
            console.log('Jobs response:', result);
            
            if (result.success) {
                setJobs(result.data.jobs || []);
                setError('');
            } else {
                setError(result.message || 'Failed to fetch jobs');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Apply filters
    const applyFilters = () => {
        fetchJobs();
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            category: '',
            type: '',
            experience: '',
            location: '',
            search: ''
        });
        setTimeout(fetchJobs, 100);
    };

    // Format salary
    const formatSalary = (salary) => {
        if (!salary || (!salary.min && !salary.max)) return 'Competitive';
        
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: salary.currency || 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        
        if (salary.min && salary.max) {
            return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
        } else if (salary.min) {
            return `From ${formatter.format(salary.min)}`;
        } else if (salary.max) {
            return `Up to ${formatter.format(salary.max)}`;
        }
        
        return 'Competitive';
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="feed-container">
                <div className="loading">
                    <h2>Loading Jobs...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="feed-container">
                <div className="error">
                    <h2>Error Loading Jobs</h2>
                    <p>{error}</p>
                    <button onClick={fetchJobs} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <header className="feed-header">
                <h1>Job Feed</h1>
                <p>Find your dream job from {jobs.length} available positions</p>
            </header>

            <section className="filters-section">
                <h2>Filter Jobs</h2>
                <div className="filters-grid">
                    <div className="filter-group">
                        <label>Search</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search jobs..."
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Category</label>
                        <select name="category" value={filters.category} onChange={handleFilterChange}>
                            <option value="">All Categories</option>
                            <option value="Technology">Technology</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="Education">Education</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="Customer Service">Customer Service</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Operations">Operations</option>
                            <option value="Legal">Legal</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label>Job Type</label>
                        <select name="type" value={filters.type} onChange={handleFilterChange}>
                            <option value="">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label>Experience Level</label>
                        <select name="experience" value={filters.experience} onChange={handleFilterChange}>
                            <option value="">All Levels</option>
                            <option value="Entry Level">Entry Level</option>
                            <option value="Mid Level">Mid Level</option>
                            <option value="Senior Level">Senior Level</option>
                            <option value="Executive">Executive</option>
                            <option value="Fresher">Fresher</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            placeholder="Filter by location..."
                        />
                    </div>
                    
                    <div className="filter-actions">
                        <button onClick={applyFilters} className="apply-filters-btn">
                            Apply Filters
                        </button>
                        <button onClick={clearFilters} className="clear-filters-btn">
                            Clear Filters
                        </button>
                    </div>
                </div>
            </section>

            <section className="jobs-section">
                <h2>Available Jobs ({jobs.length})</h2>
                
                {jobs.length === 0 ? (
                    <div className="no-jobs">
                        <h3>No Jobs Found</h3>
                        <p>Try adjusting your filters or check back later for new opportunities.</p>
                    </div>
                ) : (
                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <div key={job._id} className={`job-card ${job.featured ? 'featured' : ''}`}>
                                {job.featured && (
                                    <div className="featured-badge">
                                        🌟 Featured
                                    </div>
                                )}
                                
                                <div className="job-header">
                                    <h3 className="job-title">{job.title}</h3>
                                    <div className="job-company">{job.company}</div>
                                    <div className="job-location">📍 {job.location}</div>
                                </div>
                                
                                <div className="job-details">
                                    <div className="job-meta">
                                        <span className="job-type">{job.type}</span>
                                        <span className="job-category">{job.category}</span>
                                        <span className="job-experience">{job.experience}</span>
                                    </div>
                                    
                                    <div className="job-salary">
                                        💰 {formatSalary(job.salary)}
                                    </div>
                                    
                                    <div className="job-deadline">
                                        📅 Apply by: {formatDate(job.applicationDeadline)}
                                    </div>
                                </div>
                                
                                <div className="job-description">
                                    <p>{job.description.substring(0, 200)}...</p>
                                </div>
                                
                                <div className="job-footer">
                                    <div className="job-posted">
                                        Posted {formatDate(job.createdAt)}
                                    </div>
                                    <button className="apply-btn" onClick={() => window.location.href = `/job/${job._id}`}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default FeedPage;
