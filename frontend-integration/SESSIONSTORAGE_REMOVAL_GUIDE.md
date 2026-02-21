# 🗑️ SessionStorage Removal Guide

## **Step 1: Remove All SessionStorage Usage**

### **Find and Replace These Patterns:**

#### **❌ REMOVE:**
```javascript
// Storing data
sessionStorage.setItem('jobs', JSON.stringify(jobs));
sessionStorage.setItem('applications', JSON.stringify(applications));

// Retrieving data
const jobs = JSON.parse(sessionStorage.getItem('jobs') || '[]');
const applications = JSON.parse(sessionStorage.getItem('applications') || '[]');

// Clearing data
sessionStorage.removeItem('jobs');
sessionStorage.removeItem('applications');
sessionStorage.clear();
```

#### **✅ REPLACE WITH:**
```javascript
// Use API calls instead of sessionStorage
import { jobsAPI, applicationsAPI } from './api';

// Fetch jobs from backend
const jobs = await jobsAPI.getAllJobs();

// Fetch applications from backend
const applications = await applicationsAPI.getAllApplications();
```

---

## **Step 2: Update Component State Management**

### **❌ OLD PATTERN (SessionStorage):**
```javascript
const [jobs, setJobs] = useState(() => {
  const savedJobs = sessionStorage.getItem('jobs');
  return savedJobs ? JSON.parse(savedJobs) : [];
});

// Save to sessionStorage on change
useEffect(() => {
  sessionStorage.setItem('jobs', JSON.stringify(jobs));
}, [jobs]);
```

### **✅ NEW PATTERN (API):**
```javascript
const [jobs, setJobs] = useState([]);

// Fetch from API on mount
useEffect(() => {
  fetchJobs();
}, []);

const fetchJobs = async () => {
  try {
    const response = await jobsAPI.getAllJobs();
    setJobs(response.data || response);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
  }
};
```

---

## **Step 3: Remove SessionStorage from Form Submissions**

### **❌ OLD PATTERN:**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  const newJob = { /* job data */ };
  const existingJobs = JSON.parse(sessionStorage.getItem('jobs') || '[]');
  const updatedJobs = [...existingJobs, newJob];
  
  sessionStorage.setItem('jobs', JSON.stringify(updatedJobs));
  setJobs(updatedJobs);
};
```

### **✅ NEW PATTERN:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const newJob = { /* job data */ };
    await jobsAPI.createJob(newJob);
    
    // Refresh jobs list
    fetchJobs();
    alert('Job created successfully!');
  } catch (error) {
    console.error('Failed to create job:', error);
    alert('Failed to create job. Please try again.');
  }
};
```

---

## **Step 4: Remove SessionStorage from Application Forms**

### **❌ OLD PATTERN:**
```javascript
const submitApplication = (applicationData) => {
  const existingApplications = JSON.parse(sessionStorage.getItem('applications') || '[]');
  const newApplication = { ...applicationData, id: Date.now(), appliedDate: new Date() };
  
  const updatedApplications = [...existingApplications, newApplication];
  sessionStorage.setItem('applications', JSON.stringify(updatedApplications));
};
```

### **✅ NEW PATTERN:**
```javascript
const submitApplication = async (applicationData, resumeFile) => {
  try {
    await applicationsAPI.submitApplication(applicationData, resumeFile);
    alert('Application submitted successfully!');
    
    // Optionally refresh applications list if on dashboard
    if (onDashboard) {
      fetchApplications();
    }
  } catch (error) {
    console.error('Failed to submit application:', error);
    alert('Failed to submit application. Please try again.');
  }
};
```

---

## **Step 5: Clean Up useEffect Dependencies**

### **❌ REMOVE:**
```javascript
useEffect(() => {
  // Any useEffect that only manages sessionStorage
  sessionStorage.setItem('jobs', JSON.stringify(jobs));
}, [jobs]);

useEffect(() => {
  sessionStorage.setItem('applications', JSON.stringify(applications));
}, [applications]);
```

### **✅ KEEP:**
```javascript
useEffect(() => {
  fetchJobs();
}, []); // Only on mount

useEffect(() => {
  fetchApplications();
}, []); // Only on mount
```

---

## **Step 6: Remove SessionStorage from Page Load**

### **❌ REMOVE from index.js or App.js:**
```javascript
// Clear sessionStorage on page load
sessionStorage.clear();

// Or initialize with default data
if (!sessionStorage.getItem('jobs')) {
  sessionStorage.setItem('jobs', JSON.stringify([]));
}
```

### **✅ NO NEEDED:**
Backend API handles all data persistence. No initialization needed.

---

## **Step 7: Update Error Handling**

### **❌ OLD:**
```javascript
// No error handling with sessionStorage
const jobs = JSON.parse(sessionStorage.getItem('jobs') || '[]');
```

### **✅ NEW:**
```javascript
// Proper error handling with API
const fetchJobs = async () => {
  try {
    setLoading(true);
    const response = await jobsAPI.getAllJobs();
    setJobs(response.data || response);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    setError('Failed to load jobs. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

---

## **Step 8: Testing Your Changes**

### **✅ Verify:**
1. **No sessionStorage calls** in your entire codebase
2. **Data persists** after page refresh
3. **API calls work** for all CRUD operations
4. **Error handling** works properly
5. **Loading states** show during API calls

### **🧪 Test Cases:**
1. Create a job → Refresh page → Job should still exist
2. Submit application → Refresh dashboard → Application should be visible
3. Delete job → Refresh page → Job should be gone
4. Network error → User should see proper error message

---

## **Step 9: Performance Considerations**

### **✅ Add Loading States:**
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Show loading spinner during API calls
{loading && <div className="loading">Loading...</div>}
{error && <div className="error">{error}</div>}
```

### **✅ Add Error Boundaries:**
```javascript
// Wrap your components with error boundaries
<ErrorBoundary>
  <FeedPage />
</ErrorBoundary>
```

---

## **Step 10: Final Checklist**

### **✅ Confirm:**
- [ ] All `sessionStorage.setItem()` calls removed
- [ ] All `sessionStorage.getItem()` calls removed  
- [ ] All `sessionStorage.removeItem()` calls removed
- [ ] All `sessionStorage.clear()` calls removed
- [ ] API calls implemented for all data operations
- [ ] Loading states added
- [ ] Error handling implemented
- [ ] Data persists after refresh
- [ ] Forms submit to backend
- [ ] Dashboard shows real data

### **🎉 Result:**
Your application now uses a proper **MongoDB + Express** backend with **no sessionStorage dependency**!
