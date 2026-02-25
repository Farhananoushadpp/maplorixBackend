# 🔧 Fix ECONNREFUSED 127.0.0.1:4000 Error

## 🚨 **Error: connect ECONNREFUSED 127.0.0.1:4000**

---

## 🔍 **Root Cause**
This error means the server is **NOT RUNNING** on port 4000. The connection is being refused because there's no server listening.

---

## 🛠️ **Step-by-Step Fix**

### **Step 1: Navigate to Backend Directory**
```bash
cd c:\Users\USER-ID\CascadeProjects\maplorixBackend
```

### **Step 2: Check if Server is Running**
```bash
netstat -ano | findstr :4000
# Should return empty (no output) if server is not running
```

### **Step 3: Start the Server**
```bash
npm start
```

### **Step 4: Verify Server Started**
```bash
# Should see output like:
# Server running on port 4000
# MongoDB Connected: localhost
# API available at: http://localhost:4000/api
```

### **Step 5: Test Connection**
```bash
# Test basic connection
curl http://localhost:4000/api/test
# Should return: {"message": "Server is working"}
```

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: Server Starts but Immediately Stops**
```bash
# Check for errors in package.json
cat package.json | grep -A 5 "scripts"

# Make sure start script exists:
"scripts": {
  "start": "node server.js"
}
```

### **Issue 2: MongoDB Connection Error**
```bash
# Check if MongoDB is running
netstat -ano | findstr :27017

# If not running, start MongoDB
# For Windows with MongoDB installed:
mongod
```

### **Issue 3: Port Already in Use**
```bash
# Check what's using port 4000
netstat -ano | findstr :4000

# Kill process if needed
taskkill /PID [PID] /F
```

### **Issue 4: Missing Dependencies**
```bash
# Install missing dependencies
npm install

# Or install specific packages
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator
```

---

## 🔍 **Debug Commands**

### **Check Server Status:**
```bash
# Check if any process is listening on port 4000
netstat -ano | findstr :4000

# Check if Node.js processes are running
tasklist | findstr node
```

### **Start Server with Debug Info:**
```bash
# Start with verbose logging
DEBUG=* npm start

# Or start directly with node
node server.js
```

### **Check Environment:**
```bash
# Check if .env file exists
ls -la .env

# Check environment variables
echo $PORT
echo $MONGODB_URI
```

---

## 🌐 **Testing After Fix**

### **1. Test Basic Connection:**
```http
GET http://localhost:4000/api/test
Expected: {"message": "Server is working"}
```

### **2. Test Register:**
```http
POST http://localhost:4000/api/auth/register
Content-Type: application/json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### **3. Test Login:**
```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## ✅ **Complete Fix Sequence**

### **Step 1: Open Terminal**
```bash
# Open Command Prompt or PowerShell
cd c:\Users\USER-ID\CascadeProjects\maplorixBackend
```

### **Step 2: Start Server**
```bash
npm start
```

### **Step 3: Wait for Success Message**
```
✅ MongoDB Connected: localhost
🚀 Server running on port 4000
📡 API available at: http://localhost:4000/api
```

### **Step 4: Test in Postman**
```http
GET http://localhost:4000/api/test
```

---

## 🚨 **If Server Still Won't Start**

### **Check server.js File:**
```javascript
// Make sure server.js exists and has correct content
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### **Check Dependencies:**
```bash
# Install all required packages
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator

# Check package.json
cat package.json
```

---

## 🎯 **Quick Fix Summary**

### **The Problem:**
- Server is not running on port 4000
- Postman can't connect because no server is listening

### **The Solution:**
1. Navigate to backend directory
2. Run `npm start`
3. Wait for "Server running on port 4000" message
4. Test API endpoints

### **Expected Result:**
- Server starts successfully
- MongoDB connects
- API endpoints respond correctly
- Postman tests work

**Start the server with `npm start` and the ECONNREFUSED error will be fixed!** 🚀
