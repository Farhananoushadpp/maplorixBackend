# Google OAuth Profile Debug Guide

## Problem
Users are seeing generic "Google User" and "user@gmail.com" instead of their actual Google profile information.

## Solution Applied
I've enhanced the OAuth middleware to:

1. **Add detailed logging** to see exactly what Google profile data is received
2. **Improve name extraction** from Google profile data
3. **Better fallback logic** for missing profile fields

## Key Changes Made

### Enhanced Google OAuth Strategy
```javascript
console.log('🔍 Google OAuth Profile Data:', {
  id: profile.id,
  displayName: profile.displayName,
  name: profile.name,
  emails: profile.emails,
  photos: profile.photos
});

// Better name extraction
firstName: profile.name.givenName || profile.displayName?.split(' ')[0] || 'Google',
lastName: profile.name.familyName || profile.displayName?.split(' ').slice(1).join(' ') || 'User',
```

### Enhanced LinkedIn OAuth Strategy
```javascript
console.log('🔍 LinkedIn OAuth Profile Data:', {
  id: profile.id,
  displayName: profile.displayName,
  name: profile.name,
  emails: profile.emails,
  photos: profile.photos,
  publicProfileUrl: profile.publicProfileUrl
});
```

## Testing Steps

### 1. Add Google OAuth Credentials
Add these to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTH_CALLBACK_URL=http://localhost:4001/api/auth/oauth/callback
```

### 2. Restart Backend Server
```bash
npm run dev
```

### 3. Test Google OAuth
1. Go to your frontend
2. Click "Login with Google"
3. Check the backend console for debug output
4. Look for the "🔍 Google OAuth Profile Data:" log

### 4. Expected Profile Data Structure
Google should return:
```javascript
{
  id: "123456789",
  displayName: "John Doe",
  name: {
    givenName: "John",
    familyName: "Doe"
  },
  emails: [
    { value: "john.doe@gmail.com", type: "account" }
  ],
  photos: [
    { value: "https://lh3.googleusercontent.com/..." }
  ]
}
```

## Troubleshooting

### If Still Seeing Generic Names:
1. **Check Google API permissions** - Ensure you're requesting profile scope
2. **Verify Google Console setup** - Check OAuth consent screen configuration
3. **Check browser console** - Look for any OAuth errors
4. **Review backend logs** - Check what profile data is actually received

### Common Issues:
- **Missing profile scope** - Add `profile` and `email` to Google OAuth scope
- **Restricted Google account** - Some Google Workspace accounts have restrictions
- **CORS issues** - Ensure redirect URI matches exactly in Google Console

## Expected Result After Fix
Users should now see:
- **Real name**: "John Doe" instead of "Google User"
- **Real email**: "john.doe@gmail.com" instead of "user@gmail.com"
- **Profile picture**: Actual Google profile photo
- **Better user experience**: Personalized account creation

## Next Steps
1. Test with your actual Google account
2. Check backend console logs for profile data
3. Verify user creation in database with correct information
4. Test login flow end-to-end
