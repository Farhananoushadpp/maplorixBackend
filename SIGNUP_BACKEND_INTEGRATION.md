# 📝 Sign Up Implementation - Complete Backend Integration

## 🔗 **Backend API Endpoint**

### **📄 Registration API:**
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

Response:
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
      "permissions": [],
      "profile": {"avatar": null},
      "fullName": "John Doe"
    },
    "token": "jwt_token_here",
    "contact": {
      "id": "contact_id",
      "name": "John Doe",
      "email": "john@example.com"
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

## 🎯 **Complete Frontend Implementation**

### **📄 React Sign Up Component:**

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
        confirmPassword: '',
        phone: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setMessage('');
        
        try {
            // 🔗 CONNECT TO BACKEND API
            const response = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                    phone: formData.phone.trim()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                setMessage('✅ Registration successful! Redirecting...');
                
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
                }, 2000);
            } else {
                setMessage('❌ ' + (result.message || 'Registration failed'));
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('❌ Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Register for Maplorix</h2>
            
            {message && (
                <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? 'error' : ''}
                            placeholder="Enter your first name"
                            required
                        />
                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={errors.lastName ? 'error' : ''}
                            placeholder="Enter your last name"
                            required
                        />
                        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="Enter your email"
                        required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'error' : ''}
                        placeholder="+1234567890"
                        required
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Enter your password"
                            required
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                            placeholder="Confirm your password"
                            required
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                </div>
                
                <button type="submit" className="register-btn" disabled={loading}>
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

### **🎨 CSS Styling:**

```css
/* 📍 Location: src/pages/RegisterPage.css */
.register-container {
    max-width: 500px;
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

.register-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #555;
}

.form-group input {
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-group input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0,123,255,0.3);
}

.form-group input.error {
    border-color: #dc3545;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.register-btn {
    padding: 0.875rem 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
}

.register-btn:hover:not(:disabled) {
    background-color: #0056b3;
}

.register-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.message {
    padding: 1rem;
    border-radius: 5px;
    margin-bottom: 1rem;
    text-align: center;
}

.message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.login-link {
    text-align: center;
    margin-top: 1.5rem;
}

.link-button {
    background: none;
    border: none;
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
}

.link-button:hover {
    color: #0056b3;
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .register-container {
        margin: 1rem;
        padding: 1rem;
    }
}
```

---

## 🔗 **Backend Connection Details**

### **🌐 API Configuration:**
```javascript
const API_BASE_URL = 'http://localhost:4000/api';

// Registration endpoint
const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
```

### **📝 Data Flow:**
1. **User fills registration form**
2. **Frontend validates** input data
3. **API call made** to `/api/auth/register`
4. **Backend processes**:
   - Saves to Contact collection
   - Saves to User collection
   - Hashes password with bcrypt
   - Assigns default role: "user"
   - Generates JWT token
5. **Response returned** with user data and routing info
6. **Frontend stores** token and redirects based on role

---

## 🛠️ **Integration Testing**

### **🧪 Test Registration:**
```javascript
// Test the complete flow
const testRegistration = async () => {
    const testData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1234567890'
    };
    
    try {
        const response = await fetch('http://localhost:4000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        console.log('Registration result:', result);
        
        if (result.success) {
            console.log('✅ Registration successful!');
            console.log('User role:', result.data.user.role);
            console.log('Redirect to:', result.data.routing.redirectTo);
        }
    } catch (error) {
        console.error('❌ Registration failed:', error);
    }
};

testRegistration();
```

---

## 🎯 **Key Features Implemented**

### **✅ Form Validation:**
- **Required fields**: First name, last name, email, password, phone
- **Email format**: Valid email checking
- **Password strength**: Minimum 6 characters
- **Password confirmation**: Must match
- **Phone format**: International format validation
- **Real-time errors**: Field-level error messages

### **✅ Backend Integration:**
- **API endpoint**: `POST /api/auth/register`
- **JSON payload**: Proper data structure
- **Error handling**: Network and server errors
- **Success response**: Token storage and routing

### **✅ User Experience:**
- **Loading states**: Button disabled during submission
- **Success messages**: Clear feedback
- **Error messages**: Specific field errors
- **Navigation**: Auto-redirect after success
- **Responsive design**: Mobile-friendly layout

---

## 🚀 **Ready for Production**

### **📱 Complete Flow:**
1. **User visits** `/register` page
2. **Fills registration** form with validation
3. **Submits** → Backend processes data
4. **Success** → Token stored + role-based redirect
5. **Admin users** → `/dashboard`
6. **Regular users** → `/` (home page)

**Your complete sign up functionality with backend integration is ready!** 🎉
