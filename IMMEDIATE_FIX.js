// 🚀 IMMEDIATE FIX - Working Job Post Data
// Copy and paste this into your frontend

const jobData = {
    title: "Software Engineer",
    company: "Maplorix Company", 
    location: "Dubai, UAE",
    type: "Full-time",
    category: "Technology",
    experience: "Entry Level",
    jobRole: "Software Developer",
    description: "We are looking for a talented software engineer to join our growing team. This role involves developing innovative web applications using modern technologies like React and Node.js. The ideal candidate will have experience with full-stack development and be passionate about creating amazing user experiences.",
    requirements: "Bachelor degree in Computer Science and 2+ years of experience with web development.",
    salary: {
        min: 5000,
        max: 8000,
        currency: "USD"
    },
    featured: true,
    active: true
};

// 🌐 API Call - Copy this exactly
const postJob = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:4000/api/jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
    });
    
    const result = await response.json();
    console.log('Result:', result);
    
    if (result.success) {
        alert('✅ Job posted successfully!');
    } else {
        alert('❌ Error: ' + result.message);
    }
};

// 🎯 RUN THIS: postJob();
