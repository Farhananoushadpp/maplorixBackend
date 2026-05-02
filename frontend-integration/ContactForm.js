import React, { useState } from 'react';
import RecaptchaWidget from './RecaptchaWidget';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
    recaptchaToken: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [recaptchaReset, setRecaptchaReset] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      const submissionData = {
        ...formData
      };

      // Add test token for development
      if (!isProduction && !formData.recaptchaToken) {
        submissionData.recaptchaToken = 'test';
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        alert('Message sent successfully!');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          category: 'general',
          recaptchaToken: ''
        });
        
        // Reset reCAPTCHA
        setRecaptchaReset(prev => !prev);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

    } catch (error) {
      console.error('Contact submission error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form">
      <h2>Contact Us</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="general">General Inquiry</option>
            <option value="job-inquiry">Job Inquiry</option>
            <option value="partnership">Partnership</option>
            <option value="support">Support</option>
            <option value="complaint">Complaint</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            required
            placeholder="Please tell us how we can help you..."
          />
        </div>

        {/* reCAPTCHA Widget */}
        <RecaptchaWidget
          onTokenChange={handleRecaptchaToken}
          onExpired={handleRecaptchaExpired}
          reset={recaptchaReset}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <style jsx>{`
        .contact-form {
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
          background-color: #28a745;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        button:hover {
          background-color: #218838;
        }

        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ContactForm;
