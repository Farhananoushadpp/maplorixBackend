import React, { useState, useEffect } from 'react';

const PostJobForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        category: 'Technology',
        experience: 'Entry Level',
        jobRole: '',
        description: '',
        requirements: '',
        salary: { min: '', max: '', currency: 'USD' },
        applicationDeadline: '',
        featured: false,
        active: true
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
            setMessage('❌ Please login to post a job');
            return;
        }
        
        try {
            setUser(JSON.parse(userData));
        } catch (error) {
            console.error('Error parsing user data:', error);
            setMessage('❌ Invalid user session. Please login again.');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Title validation
        if (!formData.title) {
            newErrors.title = 'Job title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Job title must be at least 3 characters';
        }
        
        // Company validation
        if (!formData.company) {
            newErrors.company = 'Company name is required';
        } else if (formData.company.length < 2) {
            newErrors.company = 'Company name must be at least 2 characters';
        }
        
        // Location validation
        if (!formData.location) {
            newErrors.location = 'Location is required';
        } else if (formData.location.length < 2) {
            newErrors.location = 'Location must be at least 2 characters';
        }
        
        // Job Role validation
        if (!formData.jobRole) {
            newErrors.jobRole = 'Job role is required';
        }
        
        // Description validation
        if (!formData.description) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        }
        
        // Requirements validation
        if (!formData.requirements) {
            newErrors.requirements = 'Requirements are required';
        } else if (formData.requirements.length < 20) {
            newErrors.requirements = 'Requirements must be at least 20 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        if (!validateForm()) {
            setLoading(false);
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setMessage('❌ Please login to post a job');
                setLoading(false);
                return;
            }
            
            // Prepare data for API
            const apiData = {
                ...formData,
                // Clean up empty salary values
                salary: formData.salary.min || formData.salary.max ? {
                    min: formData.salary.min || undefined,
                    max: formData.salary.max || undefined,
                    currency: formData.salary.currency
                } : undefined
            };
            
            console.log('Submitting job data:', apiData);
            
            // Make API call
            const response = await fetch('http://localhost:4000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(apiData)
            });
            
            const result = await response.json();
            console.log('API Response:', result);
            
            if (result.success) {
                setMessage('✅ Job posted successfully!');
                
                // Reset form
                setFormData({
                    title: '',
                    company: '',
                    location: '',
                    type: 'Full-time',
                    category: 'Technology',
                    experience: 'Entry Level',
                    jobRole: '',
                    description: '',
                    requirements: '',
                    salary: { min: '', max: '', currency: 'USD' },
                    applicationDeadline: '',
                    featured: false,
                    active: true
                });
                
                // Redirect to feed page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/feed';
                }, 2000);
                
            } else {
                setMessage(`❌ ${result.message || 'Failed to post job'}`);
            }
            
        } catch (error) {
            console.error('Post job error:', error);
            setMessage('❌ Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="post-job-container">
                <div className="error-message">
                    <h3>Authentication Required</h3>
                    <p>Please login to post a job.</p>
                    <button onClick={() => window.location.href = '/login'}>
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="post-job-container">
            <h2>Post a New Job</h2>
            <p>Welcome, {user.firstName}! Fill in the details below to post a new job.</p>
            
            {message && (
                <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Job Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Senior Software Engineer"
                        className={errors.title ? 'error' : ''}
                    />
                    {errors.title && <div className="error-message">{errors.title}</div>}
                </div>
                
                <div className="form-group">
                    <label>Company *</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Maplorix Company"
                        className={errors.company ? 'error' : ''}
                    />
                    {errors.company && <div className="error-message">{errors.company}</div>}
                </div>
                
                <div className="form-group">
                    <label>Location *</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Dubai, UAE"
                        className={errors.location ? 'error' : ''}
                    />
                    {errors.location && <div className="error-message">{errors.location}</div>}
                </div>
                
                <div className="form-group">
                    <label>Job Role *</label>
                    <input
                        type="text"
                        name="jobRole"
                        value={formData.jobRole}
                        onChange={handleChange}
                        placeholder="e.g. Software Developer, Marketing Manager"
                        className={errors.jobRole ? 'error' : ''}
                    />
                    {errors.jobRole && <div className="error-message">{errors.jobRole}</div>}
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Job Type *</label>
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
                        <label>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
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
                </div>
                
                <div className="form-group">
                    <label>Experience Level *</label>
                    <select name="experience" value={formData.experience} onChange={handleChange}>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                        <option value="Executive">Executive</option>
                        <option value="Fresher">Fresher</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Job Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the role, responsibilities, and what you're looking for... (minimum 50 characters)"
                        className={errors.description ? 'error' : ''}
                        rows={5}
                    />
                    {errors.description && <div className="error-message">{errors.description}</div>}
                    <small className={formData.description.length < 50 ? 'error' : 'success'}>
                        Characters: {formData.description.length}/50 (minimum)
                    </small>
                </div>
                
                <div className="form-group">
                    <label>Requirements *</label>
                    <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="List the required qualifications, skills, and experience... (minimum 20 characters)"
                        className={errors.requirements ? 'error' : ''}
                        rows={4}
                    />
                    {errors.requirements && <div className="error-message">{errors.requirements}</div>}
                    <small className={formData.requirements.length < 20 ? 'error' : 'success'}>
                        Characters: {formData.requirements.length}/20 (minimum)
                    </small>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Salary Range</label>
                        <input
                            type="number"
                            name="salary.min"
                            value={formData.salary.min}
                            onChange={handleChange}
                            placeholder="Min salary"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>&nbsp;</label>
                        <input
                            type="number"
                            name="salary.max"
                            value={formData.salary.max}
                            onChange={handleChange}
                            placeholder="Max salary"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>&nbsp;</label>
                        <select name="salary.currency" value={formData.salary.currency} onChange={handleChange}>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="CAD">CAD</option>
                            <option value="AUD">AUD</option>
                            <option value="INR">INR</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Application Deadline</label>
                    <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                            />
                            Featured Job
                        </label>
                    </div>
                    
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                            />
                            Active
                        </label>
                    </div>
                </div>
                
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Posting...' : 'Post Job'}
                </button>
            </form>
        </div>
    );
};

export default PostJobForm;
