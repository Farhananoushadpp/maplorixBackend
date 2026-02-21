# 🚀 Complete Setup Guide

## **Backend Setup**

### **1. Environment Variables**
Create `.env` file in your backend root:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/maplorixDB

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=info@maplorix.com

# File Upload Configuration
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### **2. Install Dependencies**
```bash
cd maplorixBackend
npm install
```

### **3. Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

### **4. Start Backend Server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will run on: `http://localhost:4000`

---

## **Frontend Setup**

### **1. Install Axios**
```bash
cd your-frontend-folder
npm install axios
```

### **2. Copy API Integration Files**
Copy these files to your frontend:
- `api.js` → `src/services/api.js`
- `AdminPostsPage.js` → `src/components/AdminPostsPage.js`
- `FeedPage.js` → `src/components/FeedPage.js`
- `DashboardApplications.js` → `src/components/DashboardApplications.js`

### **3. Update API Base URL**
In `src/services/api.js`, update the base URL if needed:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Update if your backend runs elsewhere
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **4. Start Frontend**
```bash
npm start
```

Frontend will run on: `http://localhost:3000`

---

## **Testing Your Integration**

### **1. Test Backend API**
Open your browser and navigate to:
- `http://localhost:4000` - API root
- `http://localhost:4000/health` - Health check

### **2. Test Job Creation**
```javascript
// Test in browser console
fetch('http://localhost:4000/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Software Developer',
    company: 'Tech Corp',
    location: 'New York',
    type: 'Full-time',
    postedBy: 'admin'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### **3. Test Job Retrieval**
```javascript
// Test in browser console
fetch('http://localhost:4000/api/jobs')
.then(res => res.json())
.then(data => console.log(data));
```

---

## **Authentication (Optional)**

Your backend has JWT authentication. To use it:

### **1. Register Admin User**
```javascript
// Create admin user
fetch('http://localhost:4000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Admin User',
    email: 'admin@maplorix.com',
    password: 'admin123',
    role: 'admin'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### **2. Login and Get Token**
```javascript
// Login
fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@maplorix.com',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Token:', data.token);
  // Store token for authenticated requests
});
```

### **3. Use Token in API Calls**
```javascript
// Update your API service to include auth
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${your_token_here}`
  },
});
```

---

## **Database Schema**

### **Job Document Structure:**
```javascript
{
  "_id": ObjectId,
  "title": "Software Developer",
  "company": "Tech Corp",
  "location": "New York",
  "type": "Full-time",
  "description": "Job description...",
  "requirements": "Job requirements...",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "experience": "Mid Level",
  "postedDate": ISODate,
  "isActive": true,
  "postedBy": "admin",
  "applicationCount": 0,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### **Application Document Structure:**
```javascript
{
  "_id": ObjectId,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "New York",
  "jobRole": "Software Developer",
  "experience": "Mid Level",
  "skills": "JavaScript, React, Node.js",
  "job": ObjectId, // Reference to Job
  "resume": {
    "filename": "resume-123456789.pdf",
    "originalName": "john-doe-resume.pdf",
    "path": "/uploads/resumes/resume-123456789.pdf",
    "size": 2048576,
    "mimetype": "application/pdf"
  },
  "status": "submitted",
  "appliedDate": ISODate,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

---

## **Troubleshooting**

### **Common Issues:**

1. **MongoDB Connection Error**
   ```bash
   # Make sure MongoDB is running
   mongod
   
   # Check connection string in .env
   MONGODB_URI=mongodb://localhost:27017/maplorixDB
   ```

2. **CORS Error**
   ```bash
   # Check FRONTEND_URL in .env
   FRONTEND_URL=http://localhost:3000
   
   # Make sure frontend URL is in CORS origins list
   ```

3. **Port Already in Use**
   ```bash
   # Backend will auto-detect available port
   # Check console output for actual port used
   ```

4. **File Upload Error**
   ```bash
   # Make sure uploads directory exists
   mkdir -p uploads/resumes
   
   # Check file permissions
   chmod 755 uploads/resumes
   ```

5. **API Not Responding**
   ```bash
   # Check if backend is running
   curl http://localhost:4000/health
   
   # Check server logs for errors
   ```

---

## **Production Deployment**

### **1. Environment Variables for Production:**
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-domain.com
```

### **2. Build and Deploy:**
```bash
# Build frontend
npm run build

# Start backend in production mode
npm start
```

### **3. Use Process Manager:**
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name maplorix-backend

# Monitor
pm2 monit
```

---

## **🎉 Success!**

You now have:
- ✅ **MongoDB + Express** backend
- ✅ **No sessionStorage** dependency  
- ✅ **Persistent data storage**
- ✅ **RESTful API endpoints**
- ✅ **File upload support**
- ✅ **Error handling**
- ✅ **Authentication ready**

Your application will now **persist data across restarts** and can handle **multiple users** simultaneously!
