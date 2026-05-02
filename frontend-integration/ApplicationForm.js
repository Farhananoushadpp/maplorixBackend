import React, { useState, useRef } from 'react';
import RecaptchaWidget from './RecaptchaWidget';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    jobRole: '',
    experience: 'Entry Level',
    expectedSalary: '',
    currency: 'AED',
    coverLetter: '',
    source: 'website',
    recaptchaToken: ''
  });
  
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaReset, setRecaptchaReset] = useState(false);
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setResumeFile(file);
    }
  };

  const handleRecaptchaToken = (token) => {
    setFormData(prev => ({
      ...prev,
      recaptchaToken: token
    }));
  };

  const handleRecaptchaExpired = () => {
    setFormData(prev => ({
      ...prev,
      recaptchaToken: ''
    }));
    alert('reCAPTCHA expired. Please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if reCAPTCHA token is present (in production)
    const isProduction = import.meta.env.VITE_NODE_ENV === 'production';
    if (isProduction && !formData.recaptchaToken) {
      alert('Please complete the reCAPTCHA challenge.');
      return;
    }

    setLoading(true);

    try {
      const submissionData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'resumeFile') {
          submissionData.append(key, formData[key]);
        }
      });

      // Add resume file if present
      if (resumeFile) {
        submissionData.append('resume', resumeFile);
      }

      // Add test token for development
      if (!isProduction && !formData.recaptchaToken) {
        submissionData.append('recaptchaToken', 'test');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/applications`, {
        method: 'POST',
        body: submissionData
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          location: '',
          jobRole: '',
          experience: 'Entry Level',
          expectedSalary: '',
          currency: 'AED',
          coverLetter: '',
          source: 'website',
          recaptchaToken: ''
        });
        setResumeFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Reset reCAPTCHA
        setRecaptchaReset(prev => !prev);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

    } catch (error) {
      console.error('Application submission error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-form">
      <h2>Submit Your Application</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Dubai, UAE"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="jobRole">Job Role *</label>
          <input
            type="text"
            id="jobRole"
            name="jobRole"
            value={formData.jobRole}
            onChange={handleInputChange}
            placeholder="e.g., Software Developer"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience Level *</label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            required
          >
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="expectedSalary">Expected Salary *</label>
          <input
            type="number"
            id="expectedSalary"
            name="expectedSalary"
            value={formData.expectedSalary}
            onChange={handleInputChange}
            placeholder="5000"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
          >
            <option value="AED">AED</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="resumeFile">Resume *</label>
          <input
            type="file"
            id="resumeFile"
            name="resumeFile"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            required
          />
          <small>Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
        </div>

        <div className="form-group">
          <label htmlFor="coverLetter">Cover Letter</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            rows={5}
            placeholder="Tell us why you're interested in this position..."
          />
        </div>

        {/* reCAPTCHA Widget */}
        <RecaptchaWidget
          onTokenChange={handleRecaptchaToken}
          onExpired={handleRecaptchaExpired}
          reset={recaptchaReset}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      <style jsx>{`
        .application-form {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        input, select, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        textarea {
          resize: vertical;
        }

        button {
          background-color: #007bff;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        button:hover {
          background-color: #0056b3;
        }

        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        small {
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default ApplicationForm;
