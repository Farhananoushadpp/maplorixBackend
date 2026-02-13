import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JobDetailsPage = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationData, setApplicationData] = useState({
        fullName: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
        skills: '',
        coverLetter: '',
        resume: null
    });
    const [applicationLoading, setApplicationLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobDetails();
        checkUserAuth();
    }, [jobId]);

    const checkUserAuth = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    };

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/api/jobs/${jobId}`);
            const result = await response.json();

            if (result.success) {
                setJob(result.data.job);
                setError('');
            } else {
                setError(result.message || 'Failed to fetch job details');
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'resume') {
            setApplicationData(prev => ({
                ...prev,
                resume: files[0]
            }));
        } else {
            setApplicationData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateApplication = () => {
        const errors = {};
        
        if (!applicationData.fullName.trim()) {
            errors.fullName = 'Full name is required';
        }
        
        if (!applicationData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(applicationData.email)) {
            errors.email = 'Invalid email format';
        }
        
        if (!applicationData.phone.trim()) {
            errors.phone = 'Phone number is required';
        }
        
        if (!applicationData.experience.trim()) {
            errors.experience = 'Experience is required';
        }
        
        if (!applicationData.education.trim()) {
            errors.education = 'Education is required';
        }
        
        if (!applicationData.skills.trim()) {
            errors.skills = 'Skills are required';
        }
        
        if (!applicationData.coverLetter.trim()) {
            errors.coverLetter = 'Cover letter is required';
        } else if (applicationData.coverLetter.length < 50) {
            errors.coverLetter = 'Cover letter must be at least 50 characters';
        }
        
        return Object.keys(errors).length === 0 ? null : errors;
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateApplication();
        if (validationErrors) {
            alert('Please fix the following errors:\n' + Object.values(validationErrors).join('\n'));
            return;
        }
        
        setApplicationLoading(true);
        
        try {
            const formData = new FormData();
            
            // Add all form fields
            Object.keys(applicationData).forEach(key => {
                if (key === 'resume' && applicationData[key]) {
                    formData.append('resume', applicationData[key]);
                } else if (key !== 'resume') {
                    formData.append(key, applicationData[key]);
                }
            });
            
            // Add job ID
            formData.append('jobId', jobId);
            
            // Add user info if logged in
            if (user) {
                formData.append('userId', user._id);
            }
            
            const response = await fetch('http://localhost:4000/api/applications', {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header for FormData
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('✅ Application submitted successfully!');
                setShowApplicationForm(false);
                setApplicationData({
                    fullName: '',
                    email: '',
                    phone: '',
                    experience: '',
                    education: '',
                    skills: '',
                    coverLetter: '',
                    resume: null
                });
            } else {
                alert('❌ Error: ' + result.message);
            }
            
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('❌ Network error. Please try again.');
        } finally {
            setApplicationLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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
            <div className="job-details-container">
                <div className="loading">
                    <h2>Loading Job Details...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="job-details-container">
                <div className="error">
                    <h2>Error Loading Job</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/feed')} className="back-btn">
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="job-details-container">
                <div className="error">
                    <h2>Job Not Found</h2>
                    <p>The job you're looking for doesn't exist.</p>
                    <button onClick={() => navigate('/feed')} className="back-btn">
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="job-details-container">
            <button onClick={() => navigate('/feed')} className="back-btn">
                ← Back to Jobs
            </button>
            
            <div className="job-header">
                <h1>{job.title}</h1>
                <div className="job-meta">
                    <span className="company">🏢 {job.company}</span>
                    <span className="location">📍 {job.location}</span>
                    <span className="type">💼 {job.type}</span>
                    <span className="category">📂 {job.category}</span>
                    <span className="experience">📊 {job.experience}</span>
                    {job.featured && <span className="featured-badge">⭐ Featured</span>}
                </div>
                <div className="job-salary">
                    💰 {formatSalary(job.salary)}
                </div>
                <div className="job-deadline">
                    📅 Application Deadline: {formatDate(job.applicationDeadline)}
                </div>
            </div>

            <div className="job-content">
                <section className="job-description">
                    <h2>Job Description</h2>
                    <p>{job.description}</p>
                </section>

                <section className="job-requirements">
                    <h2>Requirements</h2>
                    <p>{job.requirements}</p>
                </section>

                <section className="job-role">
                    <h2>Job Role</h2>
                    <p>{job.jobRole}</p>
                </section>

                <section className="job-info">
                    <div className="info-grid">
                        <div className="info-item">
                            <h3>Posted Date</h3>
                            <p>{formatDate(job.createdAt)}</p>
                        </div>
                        <div className="info-item">
                            <h3>Application Count</h3>
                            <p>{job.applicationCount || 0} applications</p>
                        </div>
                        <div className="info-item">
                            <h3>Job Status</h3>
                            <p>{job.isActive ? 'Active' : 'Inactive'}</p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="job-actions">
                <button 
                    onClick={() => setShowApplicationForm(!showApplicationForm)}
                    className="apply-btn"
                >
                    {showApplicationForm ? 'Cancel Application' : 'Apply for This Job'}
                </button>
            </div>

            {showApplicationForm && (
                <div className="application-form">
                    <h2>Apply for {job.title}</h2>
                    
                    {user && (
                        <div className="user-info">
                            <p>Applying as: <strong>{user.firstName} {user.lastName}</strong> ({user.email})</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmitApplication}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={applicationData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={applicationData.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={applicationData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+1 234 567 8900"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Resume (PDF/DOC) *</label>
                                <input
                                    type="file"
                                    name="resume"
                                    onChange={handleInputChange}
                                    accept=".pdf,.doc,.docx"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Experience *</label>
                            <textarea
                                name="experience"
                                value={applicationData.experience}
                                onChange={handleInputChange}
                                placeholder="Describe your relevant work experience..."
                                rows={4}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Education *</label>
                            <textarea
                                name="education"
                                value={applicationData.education}
                                onChange={handleInputChange}
                                placeholder="Your educational background..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Skills *</label>
                            <textarea
                                name="skills"
                                value={applicationData.skills}
                                onChange={handleInputChange}
                                placeholder="List your relevant skills (e.g., JavaScript, React, Node.js, etc.)..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Cover Letter *</label>
                            <textarea
                                name="coverLetter"
                                value={applicationData.coverLetter}
                                onChange={handleInputChange}
                                placeholder="Why are you interested in this position? What makes you a good fit?"
                                rows={5}
                                required
                            />
                            <small>Minimum 50 characters</small>
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={applicationLoading}
                        >
                            {applicationLoading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default JobDetailsPage;
