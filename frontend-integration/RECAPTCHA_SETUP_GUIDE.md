# reCAPTCHA Integration Setup Guide

This guide will help you set up Google reCAPTCHA for the Maplorix job consultancy application.

## Overview

The application uses Google reCAPTCHA v2 to prevent automated bots from submitting login and registration forms.

## Prerequisites

1. Google reCAPTCHA API keys (Site Key and Secret Key)
2. Backend and frontend environment configuration

## Step 1: Get Google reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Fill in the form:
   - **Label**: Maplorix Job Consultancy
   - **reCAPTCHA type**: reCAPTCHA v2 ("I'm not a robot" Checkbox)
   - **Domains**: 
     - `localhost` (for development)
     - `maplorix.ae` (for production)
     - Any other domains you'll use
4. Accept the terms of service
5. Click **Submit**
6. Copy your **Site Key** and **Secret Key**

## Step 2: Backend Configuration

### Production Environment (.env.production)

```bash
# reCAPTCHA Configuration
RECAPTCHA_ENABLED=true
RECAPTCHA_SECRET_KEY=your_secret_key_here
RECAPTCHA_SITE_KEY=your_site_key_here
```

### Development Environment (.env)

```bash
# reCAPTCHA Configuration
RECAPTCHA_ENABLED=true
RECAPTCHA_SECRET_KEY=your_secret_key_here
RECAPTCHA_SITE_KEY=your_site_key_here
```

## Step 3: Frontend Configuration

### Frontend Environment (.env)

```bash
# reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

### Frontend Environment (.env.example)

```bash
# reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

## Step 4: Integration Components

### 1. RecaptchaWidget.js
- Handles reCAPTCHA widget rendering
- Manages token generation and expiration
- Provides callbacks for parent components

### 2. LoginForm.js
- Integrates reCAPTCHA widget
- Validates reCAPTCHA token before submission
- Handles token refresh on errors

### 3. RegisterForm.js
- Similar integration as login form
- Comprehensive form validation
- reCAPTCHA token management

### 4. API Integration (api.js)
- Sends reCAPTCHA token with authentication requests
- Handles reCAPTCHA-related errors

## Step 5: Backend Middleware

The reCAPTCHA middleware (`middleware/recaptcha.js`) automatically:

1. **Validates tokens** with Google's API
2. **Checks scores** (for v3, if applicable)
3. **Handles errors** gracefully
4. **Supports development bypass** (when enabled)

## Step 6: Usage Examples

### Login Form Usage

```javascript
import LoginForm from './LoginForm';

function App() {
  const handleLoginSuccess = (user, token) => {
    console.log('User logged in:', user);
    // Handle successful login
  };

  return (
    <LoginForm onLoginSuccess={handleLoginSuccess} />
  );
}
```

### Register Form Usage

```javascript
import RegisterForm from './RegisterForm';

function App() {
  const handleRegisterSuccess = (user, token) => {
    console.log('User registered:', user);
    // Handle successful registration
  };

  return (
    <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
  );
}
```

## Step 7: Testing

### Development Testing

1. Set up your `.env` files with test reCAPTCHA keys
2. The reCAPTCHA widget should appear on login/register forms
3. Complete the "I'm not a robot" challenge
4. Submit forms to verify token validation

### Production Testing

1. Deploy with production reCAPTCHA keys
2. Test on your production domain
3. Verify forms work correctly
4. Monitor for any reCAPTCHA-related errors

## Step 8: Troubleshooting

### Common Issues

#### 1. "reCAPTCHA Site Key Required" Error
- **Cause**: Missing or incorrect `VITE_RECAPTCHA_SITE_KEY`
- **Solution**: Set the correct site key in your frontend `.env` file

#### 2. "reCAPTCHA verification failed" Error
- **Cause**: Invalid token or secret key mismatch
- **Solution**: 
  - Verify backend `RECAPTCHA_SECRET_KEY` is correct
  - Ensure domain is registered in Google reCAPTCHA console
  - Check network connectivity to Google's API

#### 3. reCAPTCHA Widget Not Loading
- **Cause**: Network issues or blocked script loading
- **Solution**: 
  - Check browser console for script loading errors
  - Verify internet connectivity
  - Check if ad blockers are blocking reCAPTCHA

#### 4. Token Expired
- **Cause**: reCAPTCHA token expired (valid for 2 minutes)
- **Solution**: Widget automatically handles token refresh

### Debug Mode

To enable detailed reCAPTCHA logging:

```javascript
// In middleware/recaptcha.js
console.log('reCAPTCHA verification failed:', recaptchaData["error-codes"]);
```

## Step 9: Security Considerations

1. **Never expose secret keys** in frontend code
2. **Use environment-specific keys** for development vs production
3. **Monitor reCAPTCHA usage** in Google reCAPTCHA admin console
4. **Implement rate limiting** alongside reCAPTCHA
5. **Log reCAPTCHA failures** for security monitoring

## Step 10: Advanced Configuration

### Custom Styling

```css
/* Custom reCAPTCHA styling */
.g-recaptcha {
  transform: scale(0.9);
  transform-origin: 0 0;
}

.recaptcha-container {
  margin: 20px 0;
}
```

### Multiple reCAPTCHA Instances

```javascript
// For multiple forms on the same page
const [recaptchaTokens, setRecaptchaTokens] = useState({});

const handleTokenChange = (formId, token) => {
  setRecaptchaTokens(prev => ({
    ...prev,
    [formId]: token
  }));
};
```

## Step 11: Production Deployment Checklist

- [ ] Production reCAPTCHA keys configured
- [ ] Production domain registered in Google reCAPTCHA
- [ ] Frontend environment variables set
- [ ] Backend environment variables set
- [ ] Forms tested on production domain
- [ ] Error monitoring configured
- [ ] SSL certificate installed (required for reCAPTCHA)

## Support

For issues with reCAPTCHA integration:

1. Check Google reCAPTCHA documentation
2. Review browser console for errors
3. Verify environment variable configuration
4. Test with different domains and environments
5. Contact support if issues persist

---

**Note**: This implementation uses reCAPTCHA v2 (checkbox). For reCAPTCHA v3 (invisible), additional configuration would be needed.
