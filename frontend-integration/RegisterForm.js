import React, { useState } from 'react';
import RecaptchaWidget from './RecaptchaWidget';
import { authAPI } from './api';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    department: 'General',
    phone: '',
  });
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaReset, setRecaptchaReset] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRecaptchaToken = (token) => {
    setRecaptchaToken(token);
    if (errors.recaptcha) {
      setErrors(prev => ({
        ...prev,
        recaptcha: ''
      }));
    }
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken('');
    setErrors(prev => ({
      ...prev,
      recaptcha: 'reCAPTCHA expired. Please try again.'
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be between 2 and 50 characters';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be between 2 and 50 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = 'Phone number cannot exceed 20 characters';
    }

    if (!recaptchaToken) {
      newErrors.recaptcha = 'Please complete the reCAPTCHA challenge';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await authAPI.register(registrationData, recaptchaToken);
      
      if (response.success) {
        // Store token in localStorage or sessionStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Call success callback
        if (onRegisterSuccess) {
          onRegisterSuccess(response.user, response.token);
        }
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          department: 'General',
          phone: '',
        });
        setRecaptchaToken('');
        setRecaptchaReset(true);
        setTimeout(() => setRecaptchaReset(false), 100);
      } else {
        setErrors({ general: response.message || 'Registration failed' });
        setRecaptchaReset(true);
        setTimeout(() => setRecaptchaReset(false), 100);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
      
      // Reset reCAPTCHA on error
      setRecaptchaReset(true);
      setTimeout(() => setRecaptchaReset(false), 100);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Register</h2>
      
      {errors.general && (
        <div style={{ 
          color: '#dc3545', 
          backgroundColor: '#f8d7da', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: `1px solid ${errors.firstName ? '#dc3545' : '#ddd'}`, 
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="First name"
              disabled={isLoading}
            />
            {errors.firstName && (
              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.firstName}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: `1px solid ${errors.lastName ? '#dc3545' : '#ddd'}`, 
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Last name"
              disabled={isLoading}
            />
            {errors.lastName && (
              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: `1px solid ${errors.email ? '#dc3545' : '#ddd'}`, 
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {errors.email && (
            <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: `1px solid ${errors.phone ? '#dc3545' : '#ddd'}`, 
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Enter your phone number"
            disabled={isLoading}
          />
          {errors.phone && (
            <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.phone}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="role" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
              disabled={isLoading}
            >
              <option value="user">User</option>
              <option value="recruiter">Recruiter</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="department" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
              disabled={isLoading}
            >
              <option value="General">General</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: `1px solid ${errors.password ? '#dc3545' : '#ddd'}`, 
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          {errors.password && (
            <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.password}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: `1px solid ${errors.confirmPassword ? '#dc3545' : '#ddd'}`, 
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.confirmPassword}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <RecaptchaWidget
            onTokenChange={handleRecaptchaToken}
            onExpired={handleRecaptchaExpired}
            reset={recaptchaReset}
          />
          {errors.recaptcha && (
            <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.recaptcha}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !recaptchaToken}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading || !recaptchaToken ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading || !recaptchaToken ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
