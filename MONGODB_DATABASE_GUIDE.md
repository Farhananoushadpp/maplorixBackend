# 🔍 MongoDB Database Confusion - Complete Guide

## **Understanding Your Current Situation**

### **The Problem**
You're seeing multiple databases in MongoDB Compass:
- `maplorix` (your intended database from .env)
- `maplorixBackend` (mysteriously created)
- Data disappearing after restarts

### **Why This Happens**

## **1. MongoDB Database Creation Behavior**

### **Automatic Database Creation**
MongoDB **automatically creates databases** when you:
- First insert a document into a collection
- Connect to a non-existent database and perform operations

### **Database Name Sources**
```javascript
// These can all create different databases:

// From .env file (intended)
MONGODB_URI=mongodb://localhost:27017/maplorix

// Hardcoded fallback (in your old code)
mongoose.connect("mongodb://localhost:27017/maplorix")

// Default Mongoose behavior
mongoose.connect("mongodb://localhost:27017/test") // Creates "test" database

// From connection string variations
mongoose.connect("mongodb://localhost:27017/maplorixBackend") // Creates "maplorixBackend"
```

## **2. Common Causes of Multiple Databases**

### **A) Environment Variable Issues**
```javascript
// .env file not loaded properly
const mongoURI = process.env.MONGODB_URI; // undefined
// Falls back to hardcoded value
```

### **B) Multiple Connection Strings**
```javascript
// In different parts of your app
mongoose.connect("mongodb://localhost:27017/maplorix");    // Creates maplorix
mongoose.connect("mongodb://localhost:27017/maplorixBackend"); // Creates maplorixBackend
```

### **C) Test vs Production Confusion**
```javascript
// Test environment
MONGODB_URI=mongodb://localhost:27017/maplorix_test

// Production environment  
MONGODB_URI=mongodb://localhost:27017/maplorix
```

### **D) Mongoose Default Behavior**
```javascript
// No database name specified
mongoose.connect("mongodb://localhost:27017/"); // Uses "test" database
```

## **3. Why Data Disappears After Restart**

### **Scenario A: Wrong Database Connection**
```javascript
// Your app saves to "maplorixBackend"
// But .env says "maplorix"
// After restart, app connects to "maplorix" (empty)
```

### **Scenario B: Environment Variable Loading**
```javascript
// .env file not loaded
// Falls back to hardcoded connection string
// Different database each time
```

### **Scenario C: Race Conditions**
```javascript
// Multiple connections happening
// Data saved to one, read from another
```

---

## **🔧 Complete Solution**

### **Step 1: Verify Your Current Setup**

Run the verification script:
```bash
node verify-database.js
```

This will show you:
- ✅ All databases on your MongoDB server
- ✅ Which database your app is actually using
- ✅ Where your data is actually stored
- ✅ Collection counts and sample data

### **Step 2: Fix Your Connection Code**

Your updated `server.js` now includes:
- ✅ Clear logging of database name
- ✅ Connection URI verification
- ✅ Database name verification
- ✅ Collection listing on startup

### **Step 3: Standardize Your Environment**

Update your `.env` file:
```env
# Use only ONE database name
MONGODB_URI=mongodb://localhost:27017/maplorix
PORT=4000
NODE_ENV=development
JWT_SECRET=maplorix-super-secret-jwt-key-2024
JWT_EXPIRE=7d
```

### **Step 4: Clean Up Multiple Databases**

#### **Option A: Keep the "maplorix" Database**
```bash
# If your data is in "maplorixBackend", move it:
# 1. Export data from maplorixBackend
# 2. Import into maplorix
# 3. Delete maplorixBackend
```

#### **Option B: Switch to "maplorixBackend"**
```bash
# Update .env to use the database with your data:
MONGODB_URI=mongodb://localhost:27017/maplorixBackend
```

#### **Option C: Start Fresh**
```bash
# Delete all databases and start with clean "maplorix"
```

---

## **📊 How to Verify Correct Database**

### **Method 1: Console Logs**
After starting your backend, you should see:
```
🔗 Attempting to connect to MongoDB...
📍 Connection URI: mongodb://localhost:27017/maplorix
🎯 Target Database Name: maplorix
✅ MongoDB Connected Successfully!
🗄️ Database Name: maplorix
✅ Connected to correct database: maplorix
📋 Available Collections:
   - jobs (5 documents)
   - applications (12 documents)
```

### **Method 2: MongoDB Compass**
1. Open MongoDB Compass
2. Look for the database name shown in console logs
3. Verify collections and documents match

### **Method 3: Verification Script**
```bash
node verify-database.js
```

Look for:
```
👉 maplorix (2MB)     # Your target database
  maplorixBackend (1MB) # Old database
```

---

## **🚨 Common Mistakes to Avoid**

### **❌ Don't Do This:**
```javascript
// Multiple connection strings
mongoose.connect("mongodb://localhost:27017/maplorix");
mongoose.connect("mongodb://localhost:27017/maplorixBackend");

// Hardcoded fallbacks
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

// No database name
mongoose.connect("mongodb://localhost:27017/");
```

### **✅ Do This Instead:**
```javascript
// Single source of truth
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  throw new Error("MONGODB_URI environment variable is required");
}
mongoose.connect(mongoURI);
```

---

## **🔍 Troubleshooting Checklist**

### **Before Starting Backend:**
- [ ] `.env` file exists and is correctly formatted
- [ ] `MONGODB_URI` points to desired database name
- [ ] MongoDB service is running
- [ ] No other MongoDB connections are active

### **After Starting Backend:**
- [ ] Console shows correct database name
- [ ] No "database name mismatch" warnings
- [ ] Collections are listed correctly
- [ ] Connection state shows as connected

### **Testing Data Persistence:**
1. Create a test job via API
2. Stop the backend
3. Restart the backend
4. Verify job still exists via API
5. Check same database in MongoDB Compass

---

## **🎯 Expected Final Result**

### **Console Output:**
```
🔗 Attempting to connect to MongoDB...
📍 Connection URI: mongodb://localhost:27017/maplorix
🎯 Target Database Name: maplorix
✅ MongoDB Connected Successfully!
🗄️ Database Name: maplorix
🌐 Connection Host: localhost
🔌 Connection Port: 27017
📊 Connection State: 1
✅ Connected to correct database: maplorix
📋 Available Collections:
   - jobs (5 documents)
   - applications (12 documents)
Server running in development mode on port 4000
```

### **MongoDB Compass:**
- Only **one** database: `maplorix`
- Collections: `jobs`, `applications`
- Data persists after restarts
- No confusion or multiple databases

---

## **🚀 Next Steps**

1. **Run verification script**: `node verify-database.js`
2. **Start your backend**: `npm run dev`
3. **Check console output** for database verification
4. **Test data persistence** by creating and retrieving data
5. **Verify in MongoDB Compass** that you're looking at the right database

Your database confusion issue will be completely resolved! 🎉
