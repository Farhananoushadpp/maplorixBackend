# Maplorix - Public Registration & Application Guide

## 🎯 **Current Status: ✅ FULLY OPEN FOR PUBLIC**

### **✅ Registration: Open to Everyone**
- Any user can register without approval
- Both JSON and form-data registration supported
- Automatic account creation with "user" role
- No admin approval required

### **✅ Job Applications: Open to Everyone**
- Candidates can apply without registering
- Guest applications supported
- Registered users can also apply
- File uploads optional (resumes)

---

## 🌐 **API Endpoints for Public Use**

### **1. User Registration**
```bash
POST http://localhost:4000/api/auth/register
```

#### **JSON Format:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "message": "I want to apply for jobs"
}
```

#### **Form-Data Format (Website Forms):**
```
firstName: John
lastName: Doe
email: john.doe@example.com
password: password123
phone: +1234567890
message: I want to apply for jobs
```

### **2. User Login**
```bash
POST http://localhost:4000/api/auth/login
```

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### **3. Submit Application (No Registration Required)**
```bash
POST http://localhost:4000/api/applications
```

#### **Minimal Application:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "location": "New York, USA",
  "jobRole": "Software Developer",
  "experience": "3-5",
  "skills": "JavaScript, React, Node.js"
}
```

#### **Full Application:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "location": "New York, USA",
  "jobRole": "Software Developer",
  "experience": "3-5",
  "skills": "JavaScript, React, Node.js",
  "currentCompany": "Tech Company",
  "currentDesignation": "Senior Developer",
  "expectedSalary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "noticePeriod": "30 days",
  "coverLetter": "I am excited about this opportunity...",
  "linkedinProfile": "https://linkedin.com/in/johndoe",
  "portfolio": "https://johndoe.dev",
  "source": "website",
  "gender": "male",
  "workAuthorization": "citizen",
  "availability": "immediate"
}
```

---

## 🚀 **Website Integration Examples**

### **JavaScript/React Example:**
```javascript
// Registration
const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Registration successful!');
      localStorage.setItem('token', result.data.token);
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

// Application (No Login Required)
const submitApplication = async (applicationData) => {
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationData)
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Application submitted!');
    }
  } catch (error) {
    console.error('Application failed:', error);
  }
};
```

### **HTML Form Example:**
```html
<!-- Registration Form -->
<form id="registrationForm">
  <input type="text" name="firstName" required>
  <input type="text" name="lastName" required>
  <input type="email" name="email" required>
  <input type="password" name="password" required>
  <input type="tel" name="phone" required>
  <textarea name="message"></textarea>
  <button type="submit">Register</button>
</form>

<!-- Application Form (No Registration Required) -->
<form id="applicationForm">
  <input type="text" name="fullName" required>
  <input type="email" name="email" required>
  <input type="tel" name="phone" required>
  <input type="text" name="location" required>
  <input type="text" name="jobRole" required>
  <select name="experience" required>
    <option value="fresher">Fresher</option>
    <option value="1-3">1-3 years</option>
    <option value="3-5">3-5 years</option>
    <option value="5+">5+ years</option>
  </select>
  <textarea name="skills" required></textarea>
  <button type="submit">Submit Application</button>
</form>
```

---

## 🔐 **Security & Access Control**

### **✅ Public Access:**
- **Registration**: Open to everyone
- **Applications**: Open to everyone (guest and registered users)
- **Job Listings**: Open to everyone

### **🔒 Admin Only:**
- **View Applications**: Admin only (`/api/applications`)
- **Search Candidates**: Admin only (`/api/applications/search`)
- **Manage Jobs**: Authenticated users only

---

## 📊 **User Roles & Permissions**

### **👤 Regular Users (Default):**
- ✅ Register and login
- ✅ Submit applications
- ✅ View job listings
- ✅ Update their profile
- ❌ Cannot view other candidates' applications

### **👑 Admin Users:**
- ✅ All user permissions
- ✅ View all candidate applications
- ✅ Search and filter candidates
- ✅ Manage jobs
- ✅ Manage users

---

## 🎉 **Ready for Hosting!**

The system is **fully ready for public hosting**:

1. **✅ Open Registration**: Anyone can sign up
2. **✅ Guest Applications**: Candidates can apply without registering
3. **✅ File Uploads**: Resume uploads supported (optional)
4. **✅ Multiple Formats**: JSON, form-data, URL-encoded
5. **✅ Error Handling**: Clear error messages
6. **✅ Security**: Admin-only access to sensitive data
7. **✅ Scalability**: Ready for production

**Candidates can immediately start registering and submitting applications!** 🚀
