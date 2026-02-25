# 🚀 Maplorix Website Hosting Guide

## 📋 Overview

This guide will help you host your Maplorix job consultancy website with proper user authentication and role-based access control.

## 🔐 User Access Control

### **User Roles & Permissions**

#### **Regular Users (role: "user")**
- ✅ Home
- ✅ About Us  
- ✅ Feed
- ✅ Contact Us
- ❌ Dashboard
- ❌ Admin Posts

#### **Admin Users (role: "admin")**
- ✅ Home
- ✅ About Us
- ✅ Feed
- ✅ Dashboard
- ✅ Admin Posts
- ✅ Contact Us

#### **HR/Recruiter/Manager (role: "hr", "recruiter", "manager")**
- ✅ Home
- ✅ About Us
- ✅ Feed
- ✅ Dashboard
- ✅ Contact Us
- ❌ Admin Posts

## 🛠️ Pre-Deployment Setup

### **1. Environment Configuration**

Copy the production environment template:

```bash
cp .env.example .env.production
```

Update `.env.production` with your production values:

```env
# Production Environment Configuration
NODE_ENV=production
PORT=4000

# Production Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maplorix?retryWrites=true&w=majority

# Production JWT Configuration
JWT_SECRET=your-super-secure-production-jwt-secret-key-change-this-immediately
JWT_EXPIRE=7d

# Production Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
EMAIL_FROM=noreply@maplorix.com

# Production CORS Configuration
FRONTEND_URL=https://your-domain.com
```

### **2. Database Setup**

#### **MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user with password
4. Get your connection string
5. Update `MONGODB_URI` in `.env.production`

#### **Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/maplorix
```

### **3. Create Admin User**

Create an admin user for website management:

```bash
node create-admin-user.js
```

## 🚀 Deployment Options

### **Option 1: Vercel (Recommended)**

#### **Backend Deployment**
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy backend:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard

#### **Frontend Deployment**
1. Build your frontend:
```bash
cd ../maplorix
npm run build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

### **Option 2: Traditional Hosting**

#### **Server Setup**
1. Get a VPS (DigitalOcean, Vultr, etc.)
2. Install Node.js 18+
3. Install MongoDB
4. Clone your repository
5. Install dependencies:
```bash
npm install
```

6. Start the server:
```bash
node deploy.js
```

#### **Process Manager (PM2)**
Install PM2 for production:
```bash
npm install -g pm2
```

Start with PM2:
```bash
pm2 start deploy.js --name "maplorix-backend"
pm2 save
pm2 startup
```

### **Option 3: Docker Deployment**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["node", "deploy.js"]
```

Build and run:
```bash
docker build -t maplorix-backend .
docker run -p 4000:4000 maplorix-backend
```

## 📡 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### **Page Access Control**
- `GET /api/pages/navigation` - Get user's accessible pages
- `GET /api/pages/access/:pageName` - Check page access
- `GET /api/pages/public` - Get public pages

### **Jobs**
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job (admin/hr only)

### **Applications**
- `GET /api/applications` - Get applications (admin/hr only)
- `POST /api/applications` - Submit application

### **Contact**
- `POST /api/contacts` - Submit contact form

### **Admin**
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/posts` - Manage job posts

## 🧪 Testing Before Going Live

### **1. Test Authentication**
```bash
# Test registration
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"123456"}'

# Test login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
```

### **2. Test Page Access**
```bash
# Get public pages
curl http://localhost:4000/api/pages/public

# Get user navigation (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/pages/navigation
```

### **3. Test Role-Based Access**
```bash
# Test admin page access (requires admin token)
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:4000/api/pages/access/Admin%20Posts
```

## 🔒 Security Considerations

### **1. Environment Variables**
- Never commit `.env.production` to git
- Use strong, unique JWT secrets
- Rotate secrets regularly

### **2. Database Security**
- Use MongoDB Atlas with IP whitelisting
- Enable database authentication
- Use SSL connections

### **3. API Security**
- Rate limiting is enabled
- CORS is configured
- Helmet.js security headers
- Input validation on all endpoints

### **4. Password Security**
- Minimum 6 characters
- Bcrypt hashing with 12 rounds
- Password change functionality

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Database Connection Error**
```
Error: Could not connect to MongoDB
```
**Solution**: Check `MONGODB_URI` in `.env.production`

#### **2. JWT Token Error**
```
Error: invalid signature
```
**Solution**: Ensure `JWT_SECRET` is set correctly

#### **3. CORS Error**
```
Error: Access blocked by CORS policy
```
**Solution**: Update `FRONTEND_URL` in environment

#### **4. Permission Denied**
```
Error: Access denied. admin role is not authorized
```
**Solution**: Check user role and page permissions

### **Health Check**
Always test the health endpoint:
```bash
curl http://your-domain.com/health
```

## 📊 Monitoring

### **Server Health**
- `/health` endpoint provides server status
- Monitor uptime and response times
- Set up alerts for downtime

### **Database Monitoring**
- Monitor MongoDB performance
- Check connection pool usage
- Monitor query performance

## 🎯 Going Live Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Admin user created
- [ ] SSL certificate installed
- [ ] Domain pointed to server
- [ ] CORS configured for domain
- [ ] Email service configured
- [ ] File uploads working
- [ ] All endpoints tested
- [ ] Error monitoring set up
- [ ] Backup strategy implemented

## 🆘 Support

If you encounter issues:

1. Check server logs: `pm2 logs maplorix-backend`
2. Verify environment variables
3. Test database connection
4. Check API endpoints with curl
5. Review this guide for common solutions

## 🎉 Success!

Once deployed, your website will have:
- ✅ Secure user authentication
- ✅ Role-based page access control
- ✅ Admin dashboard
- ✅ Job posting system
- ✅ Application management
- ✅ Contact form
- ✅ Production-ready security

Your Maplorix job consultancy website is now ready for production! 🚀
