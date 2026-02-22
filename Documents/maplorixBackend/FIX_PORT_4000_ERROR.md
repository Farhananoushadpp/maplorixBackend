# 🔧 Fix Port 4000 Already in Use Error

## 🚨 **Error: EADDRINUSE: address already in use 0.0.0.0:4000**

---

## 🛠️ **Quick Fix Solutions**

### **Solution 1: Kill Process Using Port 4000**
```bash
# Find process using port 4000
netstat -ano | findstr :4000

# Kill the process (replace PID with actual process ID)
taskkill /PID 8732 /F

# Start server again
npm start
```

### **Solution 2: Use Different Port**
```bash
# Set different port and start
PORT=4001 npm start

# Or update .env file
echo "PORT=4001" >> .env
npm start
```

### **Solution 3: Find and Kill All Node Processes**
```bash
# Find all node processes
tasklist | findstr node

# Kill all node processes
taskkill /IM node.exe /F

# Start server again
npm start
```

---

## 🔍 **Step-by-Step Fix**

### **Step 1: Check What's Using Port 4000**
```bash
netstat -ano | findstr :4000
# Output shows: TCP 0.0.0.0:4000 LISTENING 8732
```

### **Step 2: Kill the Process**
```bash
taskkill /PID 8732 /F
# Output: SUCCESS: The process with PID 8732 has been terminated.
```

### **Step 3: Start Server**
```bash
npm start
# Should now work successfully
```

---

## 🌐 **Alternative: Use Different Port**

### **Update .env file:**
```bash
# Add or change port in .env
PORT=4001
```

### **Or set port temporarily:**
```bash
PORT=4001 npm start
```

### **Update Postman URLs:**
```
Old: http://localhost:4000/api/auth/register
New: http://localhost:4001/api/auth/register
```

---

## ✅ **Verification**

### **Check Server is Running:**
```bash
# Should see output like:
# Server running on port 4000
# MongoDB Connected: localhost
# API available at: http://localhost:4000/api
```

### **Test API in Postman:**
```http
GET http://localhost:4000/api/test
Expected: {"message": "Server is working"}
```

---

## 🚨 **Prevention Tips**

### **Always Stop Server Properly:**
```bash
# Use Ctrl+C to stop server gracefully
# Don't just close terminal window
```

### **Check Before Starting:**
```bash
# Check if port is in use
netstat -ano | findstr :4000

# If in use, kill process before starting
```

---

## 🎯 **Complete Fix Commands**

```bash
# 1. Find process using port 4000
netstat -ano | findstr :4000

# 2. Kill the process
taskkill /PID [PID] /F

# 3. Start server
npm start

# 4. Test API
curl http://localhost:4000/api/test
```

**Port 4000 error fixed! Your server should now start successfully.** 🚀
