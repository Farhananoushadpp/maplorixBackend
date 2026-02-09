// Quick user creation and test
import mongoose from 'mongoose';
import User from './models/User.js';

async function quickCreateAndTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
        console.log('✅ Connected to MongoDB');

        // Create user
        await User.deleteOne({ email: 'john.doe@company.com' });
        
        const newUser = new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            password: 'password123',
            role: 'admin',
            department: 'HR',
            isActive: true
        });

        await newUser.save();
        console.log('✅ User created');

        // Test immediately
        const testResponse = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'john.doe@company.com',
                password: 'password123'
            })
        });

        const result = await testResponse.json();
        console.log('🌐 API Test Result:');
        console.log('Status:', testResponse.status);
        console.log('Success:', result.success);
        console.log('Message:', result.message);

        if (result.success) {
            console.log('🎉 SUCCESS! Login works!');
            
            // Test job posting
            const token = result.data.token;
            const jobData = {
                title: 'Test Job - Final Working Version',
                company: 'Test Company',
                location: 'Remote',
                type: 'Full-time',
                category: 'Technology',
                experience: 'Mid Level',
                description: 'This is a test job to verify that the job posting functionality is working correctly between frontend and backend.',
                requirements: 'Strong knowledge of web development and API integration.',
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
            console.log('\n💼 Job Posting Result:');
            console.log('Status:', jobResponse.status);
            console.log('Success:', jobResult.success);
            
            if (jobResult.success) {
                console.log('✅ Job posting works!');
                console.log('Job ID:', jobResult.data.job._id);
                console.log('\n🎉 EVERYTHING IS WORKING!');
                console.log('\n📋 Frontend Instructions:');
                console.log('1. Go to http://localhost:3001');
                console.log('2. Navigate to /login');
                console.log('3. Use: john.doe@company.com / password123');
                console.log('4. Click "Post Job" in the dashboard');
                console.log('5. Fill out the form and submit');
                console.log('6. The job will be stored in the database!');
            } else {
                console.log('❌ Job posting failed:', jobResult.message);
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

quickCreateAndTest();
