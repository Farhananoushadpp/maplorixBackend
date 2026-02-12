# Role-Based Routing Implementation Guide

## 🎯 **Implementation Complete: Admin Dashboard vs Website Routing**

### **✅ What's Working:**
- **Admin users** → Redirect to `/admin/dashboard`
- **Regular users** → Redirect to `/website`
- **All other roles** (hr, recruiter, manager) → Redirect to `/website`

---

## 🌐 **API Responses with Routing Information**

### **Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user"
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

### **Registration Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "role": "user"
    },
    "token": "jwt_token_here",
    "contact": {
      "id": "contact_id",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "routing": {
      "redirectTo": "/website",
      "role": "user",
      "isAdmin": false
    }
  }
}
```

---

## 🛠️ **Frontend Implementation Examples**

### **React/JavaScript Example:**
```javascript
// Login handler
const handleLogin = async (credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const result = await response.json();
    
    if (result.success) {
      const { user, token, routing } = result.data;
      
      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Role-based routing
      if (routing.isAdmin) {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/website';
      }
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Registration handler
const handleRegistration = async (userData) => {
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
      const { user, token, routing } = result.data;
      
      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Role-based routing
      if (routing.isAdmin) {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/website';
      }
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### **Vue.js Example:**
```javascript
// In your login component
methods: {
  async login() {
    try {
      const response = await this.$axios.post('/api/auth/login', this.form);
      const { user, token, routing } = response.data.data;
      
      // Store in Vuex/localStorage
      this.$store.commit('setUser', user);
      this.$store.commit('setToken', token);
      
      // Route based on role
      if (routing.isAdmin) {
        this.$router.push('/admin/dashboard');
      } else {
        this.$router.push('/website');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
}
```

### **Angular Example:**
```typescript
// In your auth service
login(credentials: any): Observable<any> {
  return this.http.post('/api/auth/login', credentials).pipe(
    tap((response: any) => {
      if (response.success) {
        const { user, token, routing } = response.data;
        
        // Store in localStorage/service
        localStorage.setItem('token', token);
        this.userService.setCurrentUser(user);
        
        // Route based on role
        if (routing.isAdmin) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/website']);
        }
      }
    })
  );
}
```

---

## 📋 **Routing Logic Table**

| User Role | Redirect To | Is Admin | Access Level |
|------------|--------------|----------|--------------|
| **admin** | `/admin/dashboard` | ✅ true | Full admin access |
| **user** | `/website` | ❌ false | Regular user access |
| **hr** | `/website` | ❌ false | HR user access |
| **recruiter** | `/website` | ❌ false | Recruiter access |
| **manager** | `/website` | ❌ false | Manager access |

---

## 🔐 **Security Implementation**

### **Frontend Route Guards:**
```javascript
// React Router example
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/website" replace />;
  }
  
  if (!user._id) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Usage
<Route path="/admin/dashboard" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminDashboard />
  </ProtectedRoute>
} />

<Route path="/website" element={
  <ProtectedRoute>
    <Website />
  </ProtectedRoute>
} />
```

### **Backend Route Protection:**
```javascript
// Admin-only routes
router.get('/admin/dashboard', auth, requireAdmin, adminController.dashboard);

// User routes (all authenticated users)
router.get('/website', auth, websiteController.home);

// Public routes (no authentication)
router.get('/jobs', jobsController.getAllJobs);
```

---

## 🎉 **Complete User Flow:**

### **1. Admin User Flow:**
```
Login → API returns routing.isAdmin: true → Frontend redirects to /admin/dashboard
```

### **2. Regular User Flow:**
```
Login/Register → API returns routing.isAdmin: false → Frontend redirects to /website
```

### **3. Guest User Flow:**
```
Visit website → Can browse jobs → Can apply without registration
```

---

## 🚀 **Ready for Production:**

✅ **Role-based routing implemented**
✅ **Admin dashboard access secured**
✅ **Website access for all users**
✅ **Guest applications supported**
✅ **Security guards in place**
✅ **Frontend integration examples provided**

**Your website now properly routes admins to dashboard and regular users to the main website!** 🎯
