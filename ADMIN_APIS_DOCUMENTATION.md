# 🔧 **Admin APIs for Job Management**

## ✅ **Complete Admin API Endpoints Created**

---

## 🛠️ **New Admin Routes:**

### **📍 Base URL:** `/api/admin/jobs`

### **✅ Authentication:**
- **Admin-only access** - Requires admin role
- **JWT token** - Must be authenticated
- **Role verification** - Automatic admin check

---

## 📋 **Available Endpoints:**

### **🔍 GET /api/admin/jobs**
**Get all jobs with advanced filtering and pagination**

```http
GET /api/admin/jobs?page=1&limit=10&status=active&category=Technology&type=Full-time&search=developer
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (1-100, default: 10)
- `status` (optional) - Filter by status: "all", "active", "inactive", "expired"
- `category` (optional) - Filter by category
- `type` (optional) - Filter by job type
- `search` (optional) - Search in title, company, location, description

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "pagination": {
      "current": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    },
    "statistics": {
      "total": 50,
      "active": 35,
      "featured": 8,
      "expired": 7
    }
  }
}
```

### **🔍 GET /api/admin/jobs/:id**
**Get specific job with full details and applications**

```http
GET /api/admin/jobs/698dda9b225eb463b6f5aff1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "_id": "698dda9b225eb463b6f5aff1",
      "title": "Software Engineer",
      "company": "Maplorix Company",
      "applications": [...], // All applications for this job
      "postedBy": {
        "firstName": "maplorix",
        "lastName": "Company",
        "email": "maplorixae@gmail.com"
      }
    }
  }
}
```

### **✏️ PUT /api/admin/jobs/:id**
**Update any job field**

```http
PUT /api/admin/jobs/698dda9b225eb463b6f5aff1
Content-Type: application/json
Authorization: Bearer [admin_token]

{
  "title": "Updated Job Title",
  "company": "Updated Company",
  "location": "Updated Location",
  "type": "Part-time",
  "category": "Marketing",
  "experience": "Mid Level",
  "jobRole": "Updated Role",
  "description": "Updated description with at least 50 characters...",
  "requirements": "Updated requirements with at least 20 characters...",
  "salary": {
    "min": 6000,
    "max": 9000,
    "currency": "USD"
  },
  "featured": true,
  "active": true
}
```

### **🗑️ DELETE /api/admin/jobs/:id**
**Delete a job permanently**

```http
DELETE /api/admin/jobs/698dda9b225eb463b6f5aff1
Authorization: Bearer [admin_token]
```

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully",
  "data": {
    "job": {
      "_id": "698dda9b225eb463b6f5aff1",
      "title": "Software Engineer",
      "company": "Maplorix Company"
    }
  }
}
```

### **🔄 POST /api/admin/jobs/:id/toggle-featured**
**Toggle featured status of a job**

```http
POST /api/admin/jobs/698dda9b225eb463b6f5aff1/toggle-featured
Authorization: Bearer [admin_token]
```

**Response:**
```json
{
  "success": true,
  "message": "Job featured successfully",
  "data": {
    "job": {
      "_id": "698dda9b225eb463b6f5aff1",
      "title": "Software Engineer",
      "featured": true
    }
  }
}
```

### **🔄 POST /api/admin/jobs/:id/toggle-active**
**Toggle active status of a job**

```http
POST /api/admin/jobs/698dda9b225eb463b6f5aff1/toggle-active
Authorization: Bearer [admin_token]
```

**Response:**
```json
{
  "success": true,
  "message": "Job activated successfully",
  "data": {
    "job": {
      "_id": "698dda9b225eb463b6f5aff1",
      "title": "Software Engineer",
      "isActive": true
    }
  }
}
```

### **📊 GET /api/admin/jobs/statistics**
**Get comprehensive job statistics**

```http
GET /api/admin/jobs/statistics
Authorization: Bearer [admin_token]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalJobs": 150,
      "activeJobs": 95,
      "featuredJobs": 25,
      "expiredJobs": 30
    },
    "byCategory": [
      { "_id": "Technology", "count": 45, "active": 30 },
      { "_id": "Marketing", "count": 20, "active": 15 }
    ],
    "byType": [
      { "_id": "Full-time", "count": 80, "active": 55 },
      { "_id": "Part-time", "count": 25, "active": 18 }
    ],
    "byExperience": [
      { "_id": "Entry Level", "count": 35, "active": 25 },
      { "_id": "Mid Level", "count": 40, "active": 30 }
    ],
    "recentJobs": [...], // Last 5 jobs posted
    "expiringSoon": [...] // Jobs expiring in next 7 days
  }
}
```

### **🔄 POST /api/admin/jobs/bulk-operations**
**Perform bulk operations on multiple jobs**

```http
POST /api/admin/jobs/bulk-operations
Content-Type: application/json
Authorization: Bearer [admin_token]

{
  "operation": "delete", // Options: "delete", "activate", "deactivate", "feature", "unfeature"
  "jobIds": [
    "698dda9b225eb463b6f5aff1",
    "698dda9b225eb463b6f5aff2",
    "698dda9b225eb463b6f5aff3"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk delete completed successfully",
  "data": {
    "operation": "delete",
    "processedCount": 3,
    "deletedCount": 3
  }
}
```

---

## 🔐 **Security Features:**

### **✅ Admin Authentication:**
- **JWT token verification**
- **Admin role check** (`req.user.role === 'admin'`)
- **Automatic rejection** for non-admin users

### **✅ Input Validation:**
- **All inputs validated** with express-validator
- **Sanitized parameters**
- **Error handling** for invalid data

### **✅ Error Handling:**
- **Comprehensive error responses**
- **Detailed error messages**
- **Proper HTTP status codes**

---

## 🧪 **Testing Examples:**

### **✅ Test Admin Access:**
```javascript
// Login as admin first
const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'maplorixae@gmail.com',
        password: 'maplorixDXB'
    })
});

const { token } = await loginResponse.json();

// Use admin API
const jobsResponse = await fetch('http://localhost:4000/api/admin/jobs', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

const jobs = await jobsResponse.json();
console.log('Admin Jobs:', jobs);
```

### **✅ Test Job Update:**
```javascript
const updateJob = async (jobId) => {
    const response = await fetch(`http://localhost:4000/api/admin/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'Updated Job Title',
            featured: true
        })
    });
    
    const result = await response.json();
    console.log('Update Result:', result);
};
```

---

## ✅ **Integration Complete:**

### **🎯 What's Working:**
- ✅ **Admin authentication** - Secure access control
- ✅ **Complete CRUD** - Create, Read, Update, Delete
- ✅ **Advanced filtering** - Status, category, type, search
- ✅ **Bulk operations** - Multiple job management
- ✅ **Statistics dashboard** - Comprehensive analytics
- ✅ **Toggle operations** - Quick status changes
- ✅ **Error handling** - Robust error responses

### **🚀 Ready for Frontend:**
- **Admin dashboard** can be built using these APIs
- **Job management** with full control
- **Analytics and reporting** capabilities
- **Bulk operations** for efficiency

**All admin APIs are now fully functional and secure!** 🎉

**Server updated with `/api/admin` routes - ready for use!** 📡
