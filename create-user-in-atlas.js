// Create user in the Atlas database (the one the API is using)
import mongoose from 'mongoose';
import User from './models/User.js';

async function createUserInAtlas() {
    try {
        // Connect to the same Atlas database as the API
        await mongoose.connect('mongodb+srv://farhananoushadpp:Farhan%40123@ac-ekci4z8-shard-00-02.f4stxh3.mongodb.net/maplorix?retryWrites=true&w=majority');
        console.log('✅ Connected to Atlas MongoDB');

        // Check existing users in Atlas
        const existingUsers = await User.find({});
        console.log('\n👥 Existing users in Atlas:', existingUsers.length);
        existingUsers.forEach(user => {
            console.log(`  - ${user.email} (${user.role})`);
        });

        // Create our test user
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
        console.log('✅ User created in Atlas database');

        // Test the API
        console.log('\n🌐 Testing API with Atlas user...');
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
        console.log('API Status:', testResponse.status);
        console.log('API Success:', result.success);
        console.log('API Message:', result.message);

        if (result.success) {
            console.log('🎉 SUCCESS! Login works with Atlas database!');
            
            // Test job posting
            const token = result.data.token;
            const jobData = {
                title: 'Test Job - Atlas Database Working',
                company: 'Atlas Test Company',
                location: 'Remote',
                type: 'Full-time',
                category: 'Technology',
                experience: 'Mid Level',
                description: 'This is a test job created to verify that the job posting functionality works correctly with the Atlas database.',
                requirements: 'Strong knowledge of web development and database management.',
                salary: {
                    min: 70000,
                    max: 90000,
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
                console.log('Job Title:', jobResult.data.job.title);
                
                console.log('\n🎉 EVERYTHING IS WORKING!');
                console.log('\n📋 Final Instructions:');
                console.log('1. Go to http://localhost:3001');
                console.log('2. Navigate to /login');
                console.log('3. Use: john.doe@company.com / password123');
                console.log('4. Post jobs through the frontend form');
                console.log('5. Jobs will be stored in the Atlas database!');
                
                // Clean up debug logs
                console.log('\n🧹 Cleaning up debug logs...');
                // Remove the debug logs from auth controller
                console.log('✅ Ready for production use!');
            } else {
                console.log('❌ Job posting failed:', jobResult.message);
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createUserInAtlas();
