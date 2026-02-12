# 📍 Register Page Location & Implementation

## 🗺️ **Where Should Register Page Be?**

### **📱 Frontend Application Structure:**
```
📁 Your Frontend Project/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📄 LoginPage.jsx
│   ├── 📁 pages/
│   │   ├── 📄 RegisterPage.jsx  ← REGISTER PAGE GOES HERE
│   │   ├── 📄 HomePage.jsx
│   │   └── 📄 Dashboard.jsx
│   ├── 📁 App.jsx
│   └── 📁 index.js
├── 📄 package.json
└── 📄 public/
    └── 📄 index.html
```

---

## 🎯 **Register Page Implementation**

### **📄 Create RegisterPage.jsx:**

```jsx
// 📍 Location: src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: ''
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
            const response = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                setMessage('Registration successful! Redirecting...');
                
                const { user, token, routing } = result.data;
                
                // 💾 Store authentication data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // 🧭 Role-based routing
                setTimeout(() => {
                    if (routing.isAdmin) {
                        navigate('/dashboard');
                    } else {
                        navigate('/');
                    }
                }, 1500);
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
        <div className="register-container">
            <h2>Register for Maplorix</h2>
            
            {message && <div className="message">{message}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                
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
                    <label>Phone:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
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
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            
            <div className="login-link">
                <p>Already have an account? 
                    <button 
                        type="button"
                        onClick={() => navigate('/login')}
                        className="link-button"
                    >
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
```

---

## 🔗 **Router Configuration**

### **📄 Update App.jsx:**

```jsx
// 📍 Location: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';  // ← IMPORT REGISTER PAGE
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />  {/* ← ADD REGISTER ROUTE */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
```

---

## 🎨 **CSS Styling**

### **📄 Create RegisterPage.css:**

```css
/* 📍 Location: src/pages/RegisterPage.css */
.register-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.register-container h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0,123,255,0.3);
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
}

button:hover {
    background-color: #0056b3;
}

button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.message {
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    text-align: center;
}

.message:where(.error) {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.message:where(.success) {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.login-link {
    text-align: center;
    margin-top: 1rem;
}

.link-button {
    background: none;
    border: none;
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
    font-weight: bold;
}

.link-button:hover {
    color: #0056b3;
}
```

---

## 🌐 **HTML Version (if not using React)**

### **📄 Create register.html:**

```html
<!-- 📍 Location: public/register.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Maplorix</title>
    <link rel="stylesheet" href="register.css">
</head>
<body>
    <div class="register-container">
        <h2>Register for Maplorix</h2>
        
        <div id="message"></div>
        
        <form id="registerForm">
            <div class="form-group">
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" required>
            </div>
            
            <div class="form-group">
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit">Register</button>
        </form>
        
        <div class="login-link">
            <p>Already have an account? 
                <a href="/login">Login here</a>
            </p>
        </div>
    </div>

    <script src="register.js"></script>
</body>
</html>
```

### **📄 Create register.js:**

```javascript
// 📍 Location: public/register.js
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch('http://localhost:4000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('message').innerHTML = 
                '<div class="success">Registration successful! Redirecting...</div>';
            
            const { user, token, routing } = result.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            setTimeout(() => {
                if (routing.isAdmin) {
                    window.location.href = '/dashboard';
                } else {
                    window.location.href = '/';
                }
            }, 1500);
        } else {
            document.getElementById('message').innerHTML = 
                `<div class="error">${result.message}</div>`;
        }
    } catch (error) {
        document.getElementById('message').innerHTML = 
            '<div class="error">Network error. Please try again.</div>';
    }
});
```

---

## 🎯 **Complete File Structure:**

### **React Project:**
```
📁 Your Frontend/
├── 📁 src/
│   ├── 📁 pages/
│   │   ├── 📄 RegisterPage.jsx    ← REGISTER PAGE
│   │   ├── 📄 LoginPage.jsx
│   │   ├── 📄 HomePage.jsx
│   │   └── 📄 Dashboard.jsx
│   ├── 📄 App.jsx              ← UPDATE ROUTER
│   └── 📄 index.js
├── 📄 package.json
└── 📄 public/
    └── 📄 index.html
```

### **HTML Project:**
```
📁 Your Frontend/
├── 📄 register.html           ← REGISTER PAGE
├── 📄 register.js             ← REGISTER LOGIC
├── 📄 register.css             ← REGISTER STYLES
├── 📄 login.html
├── 📄 index.html
└── 📄 dashboard.html
```

---

## 🚀 **How to Access Register Page:**

### **🌐 URL:**
```
http://localhost:3000/register
```

### **🔗 Navigation Flow:**
1. **Login page** → Click "Sign up here" → `/register`
2. **Register page** → Fill form → Submit → Role-based routing
3. **Success** → Admin → `/dashboard` | User → `/`

---

## ✅ **Summary:**

### **📍 Register Page Location:**
- **React**: `src/pages/RegisterPage.jsx`
- **HTML**: `public/register.html`
- **Vue**: `src/views/RegisterPage.vue`

### **🔗 Router Setup:**
- **Add route**: `/register` → RegisterPage component
- **Update navigation**: Login page links to `/register`
- **Import component**: In main App/router file

**Create the register page in your frontend application at the locations shown above!** 🎯
