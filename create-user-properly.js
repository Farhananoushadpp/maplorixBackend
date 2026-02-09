// Create user properly without double hashing
import mongoose from 'mongoose';
import User from './models/User.js';

async function createUserProperly() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
        console.log('✅ Connected to MongoDB');

        // Delete existing user
        await User.deleteOne({ email: 'john.doe@company.com' });
        console.log('🗑️ Deleted existing user');

        // Create user with plain password (middleware will hash it)
        const newUser = new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            password: 'password123', // Plain text - middleware will hash it
            role: 'admin',
            department: 'HR',
            isActive: true
        });

        await newUser.save();
        console.log('✅ User created with plain password (middleware hashed it)');

        // Test the password
        const savedUser = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
        console.log('Stored hash:', savedUser.password.substring(0, 50) + '...');
        
        const isMatch = await savedUser.comparePassword('password123');
        console.log('Password match:', isMatch ? 'SUCCESS' : 'FAILED');

        // Test API login
        console.log('\n🌐 Testing API login...');
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'john.doe@company.com',
                    password: 'password123'
                })
            });

            const result = await response.json();
            console.log('API Status:', response.status);
            console.log('API Success:', result.success);
            console.log('API Message:', result.message);

            if (result.success) {
                console.log('🎉 SUCCESS! API login works!');
                const token = result.data.token;
                
                // Test job posting
                console.log('\n💼 Testing job posting...');
                const jobData = {
                    title: 'Test Job - Frontend Connected',
                    company: 'Test Company',
                    location: 'Remote',
                    type: 'Full-time',
                    category: 'Technology',
                    experience: 'Mid Level',
                    description: 'This is a test job created to verify that the frontend-backend connection is working properly and jobs are being stored in the database.',
                    requirements: 'Strong knowledge of React, Node.js, and web development. Experience with RESTful APIs.',
                    salary: {
                        min: 60000,
                        max: 80000,
                        currency: 'USD'
                    },
                    featured: false,
                    active: true
                };

                const jobResponse = await fetch('http://localhost:4000/api/jobs', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jobData)
                });

                const jobResult = await jobResponse.json();
                console.log('Job Status:', jobResponse.status);
                console.log('Job Success:', jobResult.success);
                
                if (jobResult.success) {
                    console.log('✅ Job posting works!');
                    console.log('Job ID:', jobResult.data.job._id);
                    console.log('Job Title:', jobResult.data.job.title);
                    
                    // Verify job is in database
                    const verifyResponse = await fetch('http://localhost:4000/api/jobs');
                    const verifyData = await verifyResponse.json();
                    console.log('Total jobs in DB:', verifyData.data.pagination.total);
                    
                    console.log('\n🎉 EVERYTHING IS WORKING!');
                    console.log('\n📋 Instructions:');
                    console.log('1. Go to http://localhost:3001');
                    console.log('2. Navigate to /login');
                    console.log('3. Use: john.doe@company.com / password123');
                    console.log('4. Post jobs through the frontend form');
                    
                } else {
                    console.log('❌ Job posting failed:', jobResult.message);
                }
            } else {
                console.log('❌ API login failed:', result.message);
            }
        } catch (error) {
            console.error('API Error:', error.message);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createUserProperly();
