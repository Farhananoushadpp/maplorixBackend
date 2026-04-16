# 🔧 Fix Login & Register Postman Errors

## 🚨 **Common Postman Errors & Solutions**

---

## 📋 **Debug Checklist**

### **1. Check Backend Server Status:**
```bash
# Navigate to backend directory
cd c:\Users\USER-ID\CascadeProjects\maplorixBackend

# Start the server
npm start
# or
node server.js

# Should see output like:
# Server running on port 4000
# MongoDB connected successfully
```

### **2. Verify API Endpoints:**
```bash
# Test with curl
curl -X GET http://localhost:4000/api/auth/test
# Should return: {"message": "Auth routes working"}

# Test register endpoint
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123","phone":"+1234567890"}'
```

### **3. Check MongoDB Connection:**
```bash
# Check if MongoDB is running
netstat -an | findstr :27017

# Or check server logs for MongoDB connection
# Should see: "MongoDB connected successfully"
```

---

## 🛠️ **Complete Fix Solutions**

### **Solution 1: Fix Backend Server Issues**

#### **Check server.js:**
```javascript
// 📍 Location: server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/jobs', require('./routes/jobs'));

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working', timestamp: new Date() });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at: http://localhost:${PORT}/api`);
});
```

### **Solution 2: Fix Auth Routes**

#### **Check routes/auth.js:**
```javascript
// 📍 Location: routes/auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Import controllers
const { register, login, getProfile } = require('../controllers/authController');

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes working', timestamp: new Date() });
});

// Register route
router.post('/register', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone number is required'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array()
        });
    }
    
    // Call register controller
    register(req, res);
});

// Login route
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array()
        });
    }
    
    // Call login controller
    login(req, res);
});

// Profile route (protected)
router.get('/me', require('../middleware/auth'), getProfile);

module.exports = router;
```

### **Solution 3: Fix Auth Controller**

#### **Check controllers/authController.js:**
```javascript
// 📍 Location: controllers/authController.js
const User = require('../models/User');
const Contact = require('../models/Contact');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register function
exports.register = async (req, res) => {
    try {
        console.log('🔄 Registration request received:', req.body);
        
        const { firstName, lastName, email, password, phone } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create contact
        const contact = new Contact({
            name: `${firstName} ${lastName}`,
            email: email.toLowerCase(),
            phone: phone,
            category: 'General',
            status: 'Active',
            message: 'New user registration'
        });
        
        await contact.save();
        console.log('✅ Contact saved:', contact._id);
        
        // Create user
        const user = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            role: 'user',
            department: 'General',
            isActive: true,
            permissions: [],
            profile: {
                avatar: null,
                bio: '',
                location: '',
                website: '',
                socialLinks: {}
            }
        });
        
        await user.save();
        console.log('✅ User saved:', user._id);
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        
        // Return success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    isActive: user.isActive,
                    fullName: user.fullName
                },
                token: token,
                contact: {
                    id: contact._id,
                    name: contact.name,
                    email: contact.email
                },
                routing: {
                    redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/website',
                    role: user.role,
                    isAdmin: user.role === 'admin'
                }
            }
        });
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// Login function
exports.login = async (req, res) => {
    try {
        console.log('🔄 Login request received:', req.body);
        
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }
        
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        
        // Update last login
        user.timeSinceLastLogin = new Date();
        await user.save();
        
        // Return success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    isActive: user.isActive,
                    permissions: user.permissions,
                    profile: user.profile,
                    fullName: user.fullName,
                    timeSinceLastLogin: user.timeSinceLastLogin
                },
                token: token,
                routing: {
                    redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/website',
                    role: user.role,
                    isAdmin: user.role === 'admin'
                }
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// Get profile function
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    phone: user.phone,
                    isActive: user.isActive,
                    permissions: user.permissions,
                    profile: user.profile,
                    fullName: user.fullName,
                    timeSinceLastLogin: user.timeSinceLastLogin
                }
            }
        });
    } catch (error) {
        console.error('❌ Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile',
            error: error.message
        });
    }
};
```

---

## 🧪 **Postman Testing Guide**

### **1. Test Server Connection:**
```http
GET http://localhost:4000/api/test
Headers: None
Body: None

Expected Response:
{
  "message": "Server is working",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **2. Test Register Endpoint:**
```http
POST http://localhost:4000/api/auth/register
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}

Expected Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "department": "General",
      "isActive": true,
      "fullName": "John Doe"
    },
    "token": "jwt_token_here",
    "routing": {
      "redirectTo": "/website",
      "role": "user",
      "isAdmin": false
    }
  }
}
```

### **3. Test Login Endpoint:**
```http
POST http://localhost:4000/api/auth/login
Headers: 
  Content-Type: application/json

Body (raw JSON):
{
  "email": "john@example.com",
  "password": "password123"
}

Expected Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "department": "General",
      "isActive": true,
      "permissions": [],
      "profile": {
        "avatar": null,
        "bio": "",
        "location": "",
        "website": "",
        "socialLinks": {}
      },
      "fullName": "John Doe",
      "timeSinceLastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here",
    "routing": {
      "redirectTo": "/website",
      "role": "user",
      "isAdmin": false
    }
  }
}
```

### **4. Test Protected Profile Endpoint:**
```http
GET http://localhost:4000/api/auth/me
Headers: 
  Content-Type: application/json
  Authorization: Bearer jwt_token_here

Expected Response:
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "department": "General",
      "phone": "+1234567890",
      "isActive": true,
      "permissions": [],
      "profile": {
        "avatar": null,
        "bio": "",
        "location": "",
        "website": "",
        "socialLinks": {}
      },
      "fullName": "John Doe",
      "timeSinceLastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 🚨 **Common Postman Errors & Fixes**

### **Error: "Could not get any response"**
- **Cause**: Backend server not running
- **Fix**: Start server with `npm start`
- **Check**: Server should show "Running on port 4000"

### **Error: "Cannot POST /api/auth/register"**
- **Cause**: Route not defined
- **Fix**: Check routes/auth.js file
- **Verify**: Route is properly exported

### **Error: "Unexpected token < in JSON"**
- **Cause**: Server returning HTML error page
- **Fix**: Check server logs for errors
- **Debug**: Check if MongoDB is connected

### **Error: "User validation failed"**
- **Cause**: Missing required fields
- **Fix**: Check User model schema
- **Verify**: All required fields are sent

### **Error: "ECONNREFUSED"**
- **Cause**: Server not accessible
- **Fix**: Check if port 4000 is available
- **Test**: Try `http://localhost:4000/api/test`

### **Error: "Invalid email or password"**
- **Cause**: Wrong credentials or user not found
- **Fix**: Check if user exists in database
- **Verify**: Email case sensitivity

---

## 🔍 **Debug Commands**

### **Check Server Status:**
```bash
# Check if server is running
netstat -an | findstr :4000

# Check MongoDB connection
netstat -an | findstr :27017

# Test API with curl
curl -X GET http://localhost:4000/api/test
```

### **Check Database:**
```javascript
// Check if users exist
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/maplorix');
const User = require('./models/User');
User.find().then(users => console.log('Users:', users.length));
"
```

---

## ✅ **Step-by-Step Fix**

### **Step 1: Start Backend Server**
```bash
cd c:\Users\USER-ID\CascadeProjects\maplorixBackend
npm start
```

### **Step 2: Test Basic Connection**
```http
GET http://localhost:4000/api/test
```

### **Step 3: Test Register**
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

### **Step 4: Test Login**
```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Follow these steps to fix Postman errors with login and register endpoints!** 🚀
