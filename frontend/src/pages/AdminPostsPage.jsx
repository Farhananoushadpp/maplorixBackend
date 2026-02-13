import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPostsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        category: '',
        type: '',
        search: ''
    });
    const [showBulkActions, setShowBulkActions] = useState(false);
    const navigate = useNavigate();

    // Check admin authentication
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            navigate('/login');
            return;
        }
        
        try {
            const user = JSON.parse(userData);
            if (user.role !== 'admin') {
                navigate('/');
                return;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
        
        fetchJobs();
    }, [navigate]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError('');
            
            const token = localStorage.getItem('token');
            
            // Build query string
            const queryParams = new URLSearchParams();
            if (filters.status !== 'all') queryParams.append('status', filters.status);
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.search) queryParams.append('search', filters.search);
            
            const queryString = queryParams.toString();
            const url = `http://localhost:4000/api/admin/jobs${queryString ? '?' + queryString : ''}`;
            
            console.log('Fetching admin jobs from:', url);
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = await response.json();
            console.log('Admin jobs response:', result);
            
            if (result.success) {
                setJobs(result.data.jobs || []);
                setError('');
            } else {
                setError(result.message || 'Failed to fetch jobs');
            }
        } catch (error) {
            console.error('Error fetching admin jobs:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        fetchJobs();
    };

    const clearFilters = () => {
        setFilters({
            status: 'all',
            category: '',
            type: '',
            search: ''
        });
        setTimeout(fetchJobs, 100);
    };

    const handleSelectJob = (jobId) => {
        setSelectedJobs(prev => {
            if (prev.includes(jobId)) {
                return prev.filter(id => id !== jobId);
            } else {
                return [...prev, jobId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedJobs.length === jobs.length) {
            setSelectedJobs([]);
        } else {
            setSelectedJobs(jobs.map(job => job._id));
        }
    };

    const toggleFeatured = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:4000/api/admin/jobs/${jobId}/toggle-featured`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Update job in local state
                setJobs(prev => prev.map(job => 
                    job._id === jobId ? result.data.job : job
                ));
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error toggling featured:', error);
            alert('Network error. Please try again.');
        }
    };

    const toggleActive = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:4000/api/admin/jobs/${jobId}/toggle-active`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Update job in local state
                setJobs(prev => prev.map(job => 
                    job._id === jobId ? result.data.job : job
                ));
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error toggling active:', error);
            alert('Network error. Please try again.');
        }
    };

    const deleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:4000/api/admin/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Remove job from local state
                setJobs(prev => prev.filter(job => job._id !== jobId));
                setSelectedJobs(prev => prev.filter(id => id !== jobId));
                alert('Job deleted successfully');
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Network error. Please try again.');
        }
    };

    const bulkDelete = async () => {
        if (selectedJobs.length === 0) {
            alert('Please select jobs to delete');
            return;
        }
        
        if (!window.confirm(`Are you sure you want to delete ${selectedJobs.length} jobs?`)) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:4000/api/admin/jobs/bulk', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ jobIds: selectedJobs })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Remove deleted jobs from local state
                setJobs(prev => prev.filter(job => !selectedJobs.includes(job._id)));
                setSelectedJobs([]);
                setShowBulkActions(false);
                alert(`${result.data.deletedCount} jobs deleted successfully`);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error bulk deleting jobs:', error);
            alert('Network error. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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

    if (loading) {
        return (
            <div className="admin-posts-container">
                <div className="loading">
                    <h2>Loading Jobs...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-posts-container">
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
        <div className="admin-posts-container">
            <header className="admin-header">
                <h1>Admin Posts Management</h1>
                <p>Manage all job postings ({jobs.length} total)</p>
            </header>

            <section className="admin-filters">
                <h2>Filters</h2>
                <div className="filter-controls">
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
                        <label>Status</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="featured">Featured</option>
                        </select>
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

            {selectedJobs.length > 0 && (
                <section className="bulk-actions">
                    <h2>Bulk Actions ({selectedJobs.length} selected)</h2>
                    <div className="bulk-buttons">
                        <button onClick={handleSelectAll} className="select-all-btn">
                            {selectedJobs.length === jobs.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button onClick={bulkDelete} className="bulk-delete-btn">
                            Delete Selected
                        </button>
                        <button onClick={() => setShowBulkActions(false)} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </section>
            )}

            <section className="jobs-table-section">
                <h2>Job Posts ({jobs.length})</h2>
                
                {jobs.length === 0 ? (
                    <div className="no-jobs">
                        <h3>No Jobs Found</h3>
                        <p>Try adjusting your filters or create a new job posting.</p>
                    </div>
                ) : (
                    <div className="jobs-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedJobs.length === jobs.length && jobs.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Title</th>
                                    <th>Company</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th>Posted</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job._id} className={!job.isActive ? 'inactive-row' : ''}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedJobs.includes(job._id)}
                                                onChange={() => handleSelectJob(job._id)}
                                            />
                                        </td>
                                        <td>
                                            <span className={job.featured ? 'featured-badge' : ''}>
                                                {job.featured ? '⭐ ' : ''}
                                                {job.title}
                                            </span>
                                        </td>
                                        <td>{job.company}</td>
                                        <td>{job.location}</td>
                                        <td>{job.type}</td>
                                        <td>{job.category}</td>
                                        <td>{formatSalary(job.salary)}</td>
                                        <td>
                                            <span className={`status-badge ${job.isActive ? 'active' : 'inactive'}`}>
                                                {job.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            {job.featured && <span className="featured-badge">Featured</span>}
                                        </td>
                                        <td>{formatDate(job.createdAt)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => toggleFeatured(job._id)}
                                                    className={`toggle-btn ${job.featured ? 'featured' : ''}`}
                                                    title="Toggle Featured"
                                                >
                                                    {job.featured ? '⭐' : '☆'}
                                                </button>
                                                <button
                                                    onClick={() => toggleActive(job._id)}
                                                    className={`toggle-btn ${job.isActive ? 'active' : 'inactive'}`}
                                                    title="Toggle Active Status"
                                                >
                                                    {job.isActive ? '👁' : '👁‍🗨'}
                                                </button>
                                                <button
                                                    onClick={() => deleteJob(job._id)}
                                                    className="delete-btn"
                                                    title="Delete Job"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminPostsPage;
