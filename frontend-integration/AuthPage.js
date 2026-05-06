import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (loggedInUser, authToken) => {
    setUser(loggedInUser);
    setToken(authToken);
    console.log('Login successful:', loggedInUser);
  };

  const handleRegisterSuccess = (registeredUser, authToken) => {
    setUser(registeredUser);
    setToken(authToken);
    console.log('Registration successful:', registeredUser);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  if (user) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '50px auto', 
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Welcome, {user.firstName} {user.lastName}!</h2>
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Department:</strong> {user.department}</p>
          <p><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Maplorix Job Consultancy</h1>
        <p>Connect with opportunities that matter</p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '30px',
        gap: '10px'
      }}>
        <button
          onClick={() => setCurrentView('login')}
          style={{
            padding: '10px 20px',
            backgroundColor: currentView === 'login' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Login
        </button>
        <button
          onClick={() => setCurrentView('register')}
          style={{
            padding: '10px 20px',
            backgroundColor: currentView === 'register' ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Register
        </button>
      </div>

      {currentView === 'login' ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <h4>Security Notice:</h4>
        <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
          <li>This application uses Google reCAPTCHA to prevent automated submissions</li>
          <li>Your data is encrypted and securely stored</li>
          <li>We never share your information with third parties</li>
          <li>Passwords are securely hashed using industry-standard encryption</li>
        </ul>
      </div>
    </div>
  );
};

export default AuthPage;
