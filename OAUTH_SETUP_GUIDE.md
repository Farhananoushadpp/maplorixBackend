# OAuth Authentication Setup Guide

## Overview
This guide explains how to set up Google and LinkedIn OAuth authentication for the Maplorix job consultancy backend.

## Prerequisites
1. Google Cloud Console account
2. LinkedIn Developer account
3. Backend server running

## Step 1: Google OAuth Setup

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API" and "People API"

### 1.2 Create OAuth Credentials
1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Add authorized redirect URI: `http://localhost:4000/api/auth/oauth/google/callback`
5. Save and copy your Client ID and Client Secret

### 1.3 Environment Variables
Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step 2: LinkedIn OAuth Setup

### 2.1 Create LinkedIn App
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps/new)
2. Create new app with:
   - App name: "Maplorix Job Consultancy"
   - LinkedIn Page: Select or create one
   - App logo: Upload your logo
   - Privacy policy URL: `http://localhost:3000/privacy`
   - Contact email: Your email

### 2.2 Configure OAuth
1. In app settings, go to "Auth" tab
2. Add redirect URL: `http://localhost:4000/api/auth/oauth/linkedin/callback`
3. Check "r_emailaddress" and "r_liteprofile" permissions
4. Save and copy your Client ID and Client Secret

### 2.3 Environment Variables
Add to your `.env` file:
```env
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

## Step 3: Backend Configuration

### 3.1 Update Environment
Update your `.env` file with all OAuth variables:
```env
# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
OAUTH_CALLBACK_URL=http://localhost:4000/api/auth/oauth/callback
FRONTEND_URL=http://localhost:3000
```

### 3.2 Restart Server
```bash
npm run dev
```

## Step 4: Frontend Integration

### 4.1 OAuth Login URLs
Create buttons/links with these URLs:
- Google: `http://localhost:4000/api/auth/oauth/google`
- LinkedIn: `http://localhost:4000/api/auth/oauth/linkedin`

### 4.2 Handle OAuth Success
Create a page at `/oauth-success` that handles:
- Extract token and user data from URL parameters
- Store JWT token in localStorage
- Redirect to dashboard

Example JavaScript:
```javascript
// In your oauth-success page
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const user = JSON.parse(decodeURIComponent(urlParams.get('user')));

// Store in localStorage
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Redirect to dashboard
window.location.href = '/dashboard';
```

## Step 5: Testing

### 5.1 Test Google OAuth
1. Click Google login button
2. Authenticate with Google
3. Should redirect to your frontend with token

### 5.2 Test LinkedIn OAuth
1. Click LinkedIn login button
2. Authenticate with LinkedIn
3. Should redirect to your frontend with token

## OAuth Flow Diagram

```
Frontend → Backend OAuth URL → Provider (Google/LinkedIn)
    ↓                                      ↓
    ← Provider Callback ← User Authenticates
    ↓
    Backend creates JWT token
    ↓
    Redirect to frontend with token
```

## Security Notes

1. **HTTPS in Production**: Always use HTTPS for OAuth callbacks in production
2. **Environment Variables**: Never commit OAuth credentials to version control
3. **Token Security**: Store JWT tokens securely in frontend (httpOnly cookies recommended)
4. **Scope Limitation**: Request minimum necessary permissions

## Troubleshooting

### Common Issues
1. **Redirect URI Mismatch**: Ensure redirect URLs match exactly in provider settings
2. **CORS Issues**: Check CORS configuration includes OAuth URLs
3. **Session Issues**: Verify session middleware is properly configured
4. **Token Generation**: Ensure JWT_SECRET is set in environment

### Debug Mode
Set `NODE_ENV=development` for detailed OAuth logging.

## User Experience

### What Users See
1. Click "Login with Google/LinkedIn"
2. Redirect to provider's authentication page
3. Grant permissions (first time only)
4. Redirect back to application
5. Automatically logged in

### Data Retrieved
- **Google**: Name, email, profile picture
- **LinkedIn**: Name, email, profile picture, headline

Both providers create user accounts automatically if they don't exist, or update existing accounts with latest profile information.
