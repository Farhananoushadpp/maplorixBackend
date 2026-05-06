import React, { useState } from 'react';
import RecaptchaWidget from './RecaptchaWidget';
import { authAPI } from './api';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await authAPI.login(formData, recaptchaToken);
      
      if (response.success) {
        // Store token in localStorage or sessionStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Call success callback
        if (onLoginSuccess) {
          onLoginSuccess(response.user, response.token);
        }
        
        // Reset form
        setFormData({ email: '', password: '' });
        setRecaptchaToken('');
        setRecaptchaReset(true);
        setTimeout(() => setRecaptchaReset(false), 100);
      } else {
        setErrors({ general: response.message || 'Login failed' });
        setRecaptchaReset(true);
        setTimeout(() => setRecaptchaReset(false), 100);
      }
    } catch (error) {
      console.error('Login error:', error);
      
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
    <div className="login-form" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
      
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
            backgroundColor: isLoading || !recaptchaToken ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading || !recaptchaToken ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
