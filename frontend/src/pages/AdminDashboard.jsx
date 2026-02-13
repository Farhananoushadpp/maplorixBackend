import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplications: 0,
        activeJobs: 0,
        featuredJobs: 0,
        recentApplications: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAdminAuth();
        fetchDashboardData();
    }, []);

    const checkAdminAuth = () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            navigate('/login');
            return;
        }
        
        try {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role !== 'admin') {
                navigate('/');
                return;
            }
            setUser(parsedUser);
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/login');
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Fetch job statistics
            const statsResponse = await fetch('http://localhost:4000/api/admin/jobs/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const statsResult = await statsResponse.json();
            
            // Fetch recent applications
            const applicationsResponse = await fetch('http://localhost:4000/api/admin/applications?limit=10', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const applicationsResult = await applicationsResponse.json();
            
            if (statsResult.success && applicationsResult.success) {
                setStats({
                    totalJobs: statsResult.data.totalJobs || 0,
                    totalApplications: applicationsResult.data.total || 0,
                    activeJobs: statsResult.data.activeJobs || 0,
                    featuredJobs: statsResult.data.featuredJobs || 0,
                    recentApplications: applicationsResult.data.applications || []
                });
            } else {
                setError('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#ffc107';
            case 'reviewed':
                return '#17a2b8';
            case 'shortlisted':
                return '#28a745';
            case 'rejected':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    const handleViewApplication = (applicationId) => {
        navigate(`/admin/applications/${applicationId}`);
    };

    const handleViewJob = (jobId) => {
        navigate(`/admin/jobs/${jobId}`);
    };

    if (loading) {
        return (
            <div className="admin-dashboard-container">
                <div className="loading">
                    <h2>Loading Dashboard...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard-container">
                <div className="error">
                    <h2>Error Loading Dashboard</h2>
                    <p>{error}</p>
                    <button onClick={fetchDashboardData} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back, {user?.firstName}! Here's your overview.</p>
            </header>

            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>{stats.totalJobs}</h3>
                        <p>Total Jobs</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <h3>{stats.totalApplications}</h3>
                        <p>Total Applications</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>{stats.activeJobs}</h3>
                        <p>Active Jobs</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <h3>{stats.featuredJobs}</h3>
                        <p>Featured Jobs</p>
                    </div>
                </div>
            </section>

            <section className="dashboard-content">
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Applications</h2>
                        <button 
                            onClick={() => navigate('/admin/applications')}
                            className="view-all-btn"
                        >
                            View All Applications
                        </button>
                    </div>
                    
                    {stats.recentApplications.length === 0 ? (
                        <div className="no-data">
                            <h3>No Recent Applications</h3>
                            <p>Applications will appear here when candidates apply for jobs.</p>
                        </div>
                    ) : (
                        <div className="applications-list">
                            {stats.recentApplications.map((application) => (
                                <div key={application._id} className="application-card">
                                    <div className="application-header">
                                        <div className="applicant-info">
                                            <h4>{application.fullName}</h4>
                                            <p>{application.email}</p>
                                            <p>📱 {application.phone}</p>
                                        </div>
                                        <div className="application-status">
                                            <span 
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(application.status) }}
                                            >
                                                {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="application-details">
                                        <div className="job-info">
                                            <h5>Applied for: {application.job?.title}</h5>
                                            <p>🏢 {application.job?.company}</p>
                                            <p>📍 {application.job?.location}</p>
                                        </div>
                                        
                                        <div className="application-meta">
                                            <p>📅 Applied: {formatDate(application.createdAt)}</p>
                                            {application.skills && (
                                                <p>💼 Skills: {application.skills}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="application-actions">
                                        <button 
                                            onClick={() => handleViewApplication(application._id)}
                                            className="view-btn"
                                        >
                                            View Full Application
                                        </button>
                                        <button 
                                            onClick={() => handleViewJob(application.job?._id)}
                                            className="view-job-btn"
                                        >
                                            View Job Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                    </div>
                    
                    <div className="quick-actions">
                        <button 
                            onClick={() => navigate('/admin/posts')}
                            className="action-btn"
                        >
                            📝 Manage Jobs
                        </button>
                        <button 
                            onClick={() => navigate('/admin/applications')}
                            className="action-btn"
                        >
                            📋 View All Applications
                        </button>
                        <button 
                            onClick={() => navigate('/post-job')}
                            className="action-btn"
                        >
                            ➕ Create New Job
                        </button>
                        <button 
                            onClick={() => navigate('/feed')}
                            className="action-btn"
                        >
                            👁 View Public Feed
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
