# 🌐 Login Page with Sign Up Link Implementation

## 📝 **Frontend Implementation Examples**

### **🎯 HTML/JavaScript Implementation:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Maplorix</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .login-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }
        .btn {
            width: 100%;
            padding: 0.75rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            margin-bottom: 1rem;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .signup-link {
            text-align: center;
            margin-top: 1rem;
        }
        .signup-link a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signup-link a:hover {
            text-decoration: underline;
        }
        .error {
            color: #dc3545;
            margin-bottom: 1rem;
            padding: 0.5rem;
            background-color: #f8d7da;
            border-radius: 5px;
        }
        .success {
            color: #155724;
            margin-bottom: 1rem;
            padding: 0.5rem;
            background-color: #d4edda;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>Login to Maplorix</h2>
        
        <div id="message"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="btn">Login</button>
        </form>
        
        <!-- 🎯 SIGN UP LINK HERE -->
        <div class="signup-link">
            <p>Don't have an account? <a href="/register" id="signupLink">Sign up here</a></p>
        </div>
    </div>

    <script>
        // 🌐 Backend API Configuration
        const API_BASE_URL = 'http://localhost:4000/api';
        
        // 📝 Login Form Handler
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('message');
            
            try {
                // 🔐 API Call to Login
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // ✅ Login Success
                    messageDiv.innerHTML = `<div class="success">Login successful! Redirecting...</div>`;
                    
                    const { user, token, routing } = result.data;
                    
                    // 💾 Store Token and User Data
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    // 🧭 Role-based Routing
                    if (routing.isAdmin) {
                        // 👑 Admin goes to dashboard
                        window.location.href = '/dashboard';
                    } else {
                        // 👤 Regular user goes to home page
                        window.location.href = '/';
                    }
                } else {
                    // ❌ Login Error
                    messageDiv.innerHTML = `<div class="error">${result.message}</div>`;
                }
            } catch (error) {
                messageDiv.innerHTML = `<div class="error">Network error. Please try again.</div>`;
            }
        });
        
        // 🎯 Sign Up Link Handler
        document.getElementById('signupLink').addEventListener('click', (e) => {
            e.preventDefault();
            
            // 🔄 Navigate to Register Page
            window.location.href = '/register';
        });
    </script>
</body>
</html>
```

---

## 🎯 **React Implementation:**

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                const { user, token, routing } = result.data;
                
                // 💾 Store authentication data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // 🧭 Role-based navigation
                if (routing.isAdmin) {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login to Maplorix</h2>
            
            {message && <div className="message">{message}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            
            {/* 🎯 SIGN UP LINK */}
            <div className="signup-link">
                <p>
                    Don't have an account? 
                    <button 
                        type="button" 
                        onClick={() => navigate('/register')}
                        className="link-button"
                    >
                        Sign up here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
```

---

## 🎯 **Vue.js Implementation:**

```vue
<template>
    <div class="login-container">
        <h2>Login to Maplorix</h2>
        
        <div v-if="message" :class="messageType">{{ message }}</div>
        
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="email">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="formData.email" 
                    required 
                />
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    v-model="formData.password" 
                    required 
                />
            </div>
            
            <button type="submit" :disabled="loading">
                {{ loading ? 'Logging in...' : 'Login' }}
            </button>
        </form>
        
        <!-- 🎯 SIGN UP LINK -->
        <div class="signup-link">
            <p>
                Don't have an account? 
                <router-link to="/register" class="signup-link">
                    Sign up here
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginPage',
    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            message: '',
            messageType: '',
            loading: false
        }
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            
            try {
                const response = await fetch('http://localhost:4000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    const { user, token, routing } = result.data;
                    
                    // 💾 Store authentication data
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    // 🧭 Role-based navigation
                    if (routing.isAdmin) {
                        this.$router.push('/dashboard');
                    } else {
                        this.$router.push('/');
                    }
                } else {
                    this.message = result.message;
                    this.messageType = 'error';
                }
            } catch (error) {
                this.message = 'Network error. Please try again.';
                this.messageType = 'error';
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.signup-link {
    text-align: center;
    margin-top: 1rem;
}

.signup-link a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
}

.signup-link a:hover {
    text-decoration: underline;
}
</style>
```

---

## 🔗 **Backend API Endpoints Used:**

### **📝 Login Endpoint:**
```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here",
    "routing": {
      "redirectTo": "/website",
      "role": "user",
      "isAdmin": false
    }
  }
}
```

### **📝 Registration Endpoint:**
```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

---

## 🎯 **Key Implementation Points:**

### **✅ Sign Up Link Features:**
- **Text**: "Don't have an account? Sign up here"
- **Navigation**: Redirects to `/register` page
- **Styling**: Highlighted as clickable link
- **Accessibility**: Proper semantic HTML structure

### **🧭 Role-based Routing:**
- **Admin users**: Redirect to `/dashboard`
- **Regular users**: Redirect to `/` (home page)
- **Based on API response**: `routing.isAdmin` boolean

### **🔐 Security Features:**
- **JWT token storage** in localStorage
- **User data storage** for session management
- **Error handling** for failed login attempts
- **Loading states** for better UX

---

## 🚀 **Ready to Implement:**

### **📱 Frontend Routes Needed:**
- `/login` - Login page with sign up link
- `/register` - Registration page
- `/dashboard` - Admin dashboard (admin only)
- `/` - Home page (all users)

### **🔗 Navigation Flow:**
1. User visits login page
2. Sees "Don't have an account? Sign up here"
3. Clicks "Sign up here" link
4. Navigates to registration page
5. Completes registration and gets role-based routing

**Your login page with "Sign up here" link is ready for implementation!** 🎉
