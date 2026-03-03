# Maplorix Website Deployment Guide

## 🎯 Access Control Implementation

### **👤 Regular Users Can Access:**
- ✅ **Home** (`/`)
- ✅ **About Us** (`/about`)
- ✅ **Feed** (`/feed`) - Public job listings
- ✅ **Contact Us** (`/contact`)

### **👨‍💼 Admin Can Access:**
- ✅ **All pages** including:
  - Dashboard (`/dashboard`)
  - Admin Posts (`/admin-posts`)
  - Applications management
  - All other admin features

## 🔐 Access Control Features

### **Route Protection:**
- **RouteAccess Component**: Controls page access based on user role
- **Automatic Redirects**: 
  - Regular users trying to access admin pages → redirected to Home
  - Unauthenticated users → redirected to Login
- **Loading States**: Shows spinner while checking authentication

### **Navigation Control:**
- **Header Component**: Hides admin links from regular users
- **Mobile Menu**: Same access control in mobile navigation
- **Public Navigation**: Shows only accessible pages to each user type

## 🚀 Deployment Steps

### **1. Backend Deployment:**
```bash
# Ensure backend is running on port 4001
cd maplorixBackend
npm start
```

### **2. Frontend Build:**
```bash
# Build for production
cd maplorix
npm run build
```

### **3. Environment Variables:**
```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/maplorix
PORT=4001
JWT_SECRET=your-jwt-secret

# Frontend (.env)
REACT_APP_API_BASE_URL=http://localhost:4001/api
```

### **4. Hosting Options:**

#### **Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd maplorix
vercel --prod

# Deploy backend (separate project)
cd maplorixBackend
vercel --prod
```

#### **Option B: Netlify**
```bash
# Deploy frontend
cd maplorix
npm run build
# Upload build folder to Netlify

# Backend: Use Netlify Functions or separate hosting
```

#### **Option C: Traditional Hosting**
- **Frontend**: Upload build folder to web server
- **Backend**: Deploy Node.js app to server (PM2 recommended)

## 🔧 Configuration Notes

### **CORS Setup:**
```javascript
// Backend - Allow your frontend domain
const corsOptions = {
  origin: ['https://yourdomain.com', 'http://localhost:3000'],
  credentials: true
}
```

### **Database:**
- **MongoDB Atlas** for production
- **Local MongoDB** for development

### **SSL Certificate:**
- Required for production
- Let's Encrypt (free) or paid certificate

## 📋 Testing Access Control

### **Test User Accounts:**
1. **Regular User**: Can access Home, About, Feed, Contact only
2. **Admin User**: Can access all pages including admin features

### **Test Scenarios:**
1. **Unauthenticated User**: 
   - Can access public pages
   - Redirected to login for protected pages
   
2. **Regular User**:
   - Can access public pages
   - Redirected to home for admin pages
   
3. **Admin User**:
   - Can access all pages
   - Sees admin navigation links

## 🎉 Ready for Launch!

The website is now ready with:
- ✅ **User access control** implemented
- ✅ **Route protection** active
- ✅ **Navigation filtering** working
- ✅ **Job source separation** functional
- ✅ **Resume upload** system working

**Deploy today and users will have controlled access based on their roles!** 🚀
