# reCAPTCHA Setup Guide for Maplorix Backend

## Overview

This guide explains how to configure Google reCAPTCHA for the Maplorix job consultancy backend to prevent spam and automated abuse.

## Prerequisites

- Google reCAPTCHA account (free)
- Access to Google reCAPTCHA admin console
- Backend server access

## Setup Instructions

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Fill in the form:
   - **Label**: Maplorix Job Consultancy
   - **reCAPTCHA type**: Choose one:
     - **reCAPTCHA v2** ("I'm not a robot" checkbox) - Recommended for forms
     - **reCAPTCHA v3** (invisible, score-based) - Better user experience
   - **Domains**:
     - `maplorix.ae` (production)
     - `localhost` (development)
     - Any other domains you use
4. Accept the terms of service
5. Submit the form
6. Copy your **Site Key** and **Secret Key**

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# reCAPTCHA Configuration
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEbQjQ5y3FkT_y  # Replace with your actual secret key
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEbQjQ5y3FkT_y    # Replace with your actual site key
```

**Important**: Replace the keys with your actual keys from Google. The keys above are Google's test keys.

### 3. Frontend Integration

Your frontend needs to:

1. **Include reCAPTCHA script** (add to HTML head):

   ```html
   <!-- For reCAPTCHA v2 -->
   <script src="https://www.google.com/recaptcha/api.js" async defer></script>

   <!-- For reCAPTCHA v3 -->
   <script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
   ```

2. **Add reCAPTCHA widget to forms**:

   **reCAPTCHA v2 (checkbox)**:

   ```html
   <div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
   ```

   **reCAPTCHA v3 (invisible)**:

   ```javascript
   grecaptcha.ready(function () {
     grecaptcha
       .execute("YOUR_SITE_KEY", { action: "submit" })
       .then(function (token) {
         // Add token to your form submission
         document.getElementById("recaptchaToken").value = token;
         // Submit form
       });
   });
   ```

3. **Include token in form data**:
   ```javascript
   const formData = {
     // ... other form fields
     recaptchaToken: token, // or gRecaptchaResponse for v2
   };
   ```

### 4. Backend Configuration

The backend is already configured with:

- **reCAPTCHA middleware** (`middleware/recaptcha.js`)
- **Automatic verification** for application and contact forms
- **Development bypass** for testing
- **Error handling** and validation

### 5. Testing

#### Development Testing

In development mode, reCAPTCHA verification is bypassed. You can test with:

- `recaptchaToken: "test"`
- `recaptchaToken: "dev"`
- `recaptchaToken: "localhost"`

#### Production Testing

Use Google's test keys for initial testing:

- **Site Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEbQjQ5y3FkT_y`
- **Secret Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEbQjQ5y3FkT_y`

**Important**: Replace test keys with production keys before going live!

## Configuration Options

### Environment Variables

```env
# Required
RECAPTCHA_SECRET_KEY=your_secret_key_here
RECAPTCHA_SITE_KEY=your_site_key_here

# Optional (for reCAPTCHA v3)
RECAPTCHA_MIN_SCORE=0.5  # Minimum score threshold (0.0-1.0)

# Optional (for development)
ENABLE_RECAPTCHA_IN_DEV=true  # Enable reCAPTCHA in development
```

### reCAPTCHA v3 Score Threshold

If using reCAPTCHA v3, you can set the minimum score:

```env
RECAPTCHA_MIN_SCORE=0.5
```

- **0.0**: Most lenient (allows more bots)
- **1.0**: Most strict (may block legitimate users)
- **0.5**: Recommended balance

## Features

### Automatic Protection

- **Application forms**: Protected against spam submissions
- **Contact forms**: Protected against spam messages
- **Rate limiting**: Combined with reCAPTCHA for better protection

### Security Features

- **IP verification**: Optional IP-based verification
- **Score validation**: For reCAPTCHA v3
- **Error logging**: Detailed error reporting
- **Fallback handling**: Graceful degradation

### Development Support

- **Bypass mode**: Automatic bypass in development
- **Test tokens**: Accept common test tokens
- **Debug logging**: Enhanced logging in development

## Troubleshooting

### Common Issues

1. **"reCAPTCHA secret key is not configured"**
   - Solution: Add `RECAPTCHA_SECRET_KEY` to `.env` file

2. **"reCAPTCHA verification failed"**
   - Check if keys are correct
   - Verify domain is registered in reCAPTCHA admin console
   - Check network connectivity to Google's servers

3. **Forms not working in production**
   - Ensure production environment is set: `NODE_ENV=production`
   - Verify actual reCAPTCHA keys (not test keys)
   - Check CORS configuration

4. **reCAPTCHA widget not showing**
   - Verify site key is correct
   - Check domain registration
   - Ensure script is loaded properly

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
ENABLE_RECAPTCHA_IN_DEV=true
```

## Security Best Practices

1. **Never expose secret key** in frontend code
2. **Use HTTPS** in production (required by reCAPTCHA)
3. **Register all domains** you'll use (staging, production)
4. **Monitor error logs** for verification failures
5. **Implement rate limiting** alongside reCAPTCHA
6. **Regular key rotation** (optional but recommended)

## Monitoring

Monitor these metrics:

- reCAPTCHA verification success rate
- Error rates and types
- Geographic distribution of submissions
- Time-based patterns (to detect attacks)

## Support

For reCAPTCHA-specific issues:

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [reCAPTCHA Troubleshooting Guide](https://developers.google.com/recaptcha/docs/troubleshooting)

For Maplorix backend issues:

- Check server logs
- Verify environment configuration
- Test with development bypass mode
