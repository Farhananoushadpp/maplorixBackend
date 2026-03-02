// Frontend OAuth Integration Example

// OAuth Login Component
const OAuthLoginButtons = () => {
  const handleOAuthLogin = (provider) => {
    // Redirect to backend OAuth endpoint
    window.location.href = `http://localhost:4000/api/auth/oauth/${provider}`;
  };

  return (
    <div className="oauth-login">
      <h3>Or login with:</h3>
      
      <button 
        onClick={() => handleOAuthLogin('google')}
        className="oauth-btn google-btn"
      >
        <img src="/google-icon.png" alt="Google" />
        Login with Google
      </button>
      
      <button 
        onClick={() => handleOAuthLogin('linkedin')}
        className="oauth-btn linkedin-btn"
      >
        <img src="/linkedin-icon.png" alt="LinkedIn" />
        Login with LinkedIn
      </button>
    </div>
  );
};

// OAuth Success Handler (for /oauth-success page)
const handleOAuthSuccess = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');

    if (token && user) {
      try {
        // Parse user data
        const userData = JSON.parse(decodeURIComponent(user));
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update application state
        // setUser(userData);
        // setIsAuthenticated(true);
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Error parsing OAuth data:', error);
        window.location.href = '/login?error=oauth_failed';
      }
    } else {
      window.location.href = '/login?error=no_token';
    }
  }, []);

  return (
    <div className="oauth-loading">
      <h2>Completing login...</h2>
      <p>Please wait while we set up your account.</p>
    </div>
  );
};

// API Service with OAuth Support
export const authAPI = {
  // Regular login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // OAuth login URLs
  getGoogleOAuthUrl: () => 'http://localhost:4000/api/auth/oauth/google',
  getLinkedInOAuthUrl: () => 'http://localhost:4000/api/auth/oauth/linkedin',

  // Check if user is authenticated
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user ? JSON.parse(user) : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

// CSS for OAuth buttons
const oauthStyles = `
  .oauth-login {
    margin: 20px 0;
    text-align: center;
  }

  .oauth-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    margin: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .oauth-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  .google-btn:hover {
    border-color: #4285f4;
    background: #f8f9fa;
  }

  .linkedin-btn:hover {
    border-color: #0077b5;
    background: #f8f9fa;
  }

  .oauth-btn img {
    width: 20px;
    height: 20px;
  }

  .oauth-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }
`;

export default OAuthLoginButtons;
