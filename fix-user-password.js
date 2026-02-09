// Fix the test user password
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

async function fixUserPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
        console.log('✅ Connected to MongoDB');

        // Delete and recreate the test user with proper password
        await User.deleteOne({ email: 'john.doe@company.com' });
        console.log('🗑️ Deleted existing test user');

        // Create new user with proper password
        const hashedPassword = await bcrypt.hash('password123', 12);
        console.log('🔐 Created new hash:', hashedPassword.substring(0, 50) + '...');

        const newUser = new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            password: hashedPassword,
            role: 'admin',
            department: 'HR',
            isActive: true
        });

        await newUser.save();
        console.log('✅ New test user created!');

        // Test the password immediately
        const savedUser = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
        const isMatch = await savedUser.comparePassword('password123');
        console.log('🔍 Password verification:', isMatch ? 'SUCCESS' : 'FAILED');

        // Test login via API
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
            console.log('API Login Status:', response.status);
            console.log('API Login Success:', result.success);

            if (result.success) {
                console.log('🎉 API Login successful!');
                console.log('📧 Use these credentials:');
                console.log('   Email: john.doe@company.com');
                console.log('   Password: password123');
                
                // Test job posting
                console.log('\n💼 Testing job posting...');
                const token = result.data.token;
                const jobData = {
                    title: 'Test Job from API',
                    company: 'Test Company',
                    location: 'Remote',
                    type: 'Full-time',
                    category: 'Technology',
                    experience: 'Mid Level',
                    description: 'This is a test job created via API to verify the backend connection is working properly.',
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
                console.log('Job Posting Status:', jobResponse.status);
                console.log('Job Posting Success:', jobResult.success);

                if (jobResult.success) {
                    console.log('✅ Job posting successful!');
                    console.log('🆔 Job ID:', jobResult.data.job._id);
                    console.log('💼 Job Title:', jobResult.data.job.title);
                } else {
                    console.log('❌ Job posting failed:', jobResult.message);
                }
            } else {
                console.log('❌ API Login failed:', result.message);
            }
        } catch (error) {
            console.error('❌ API test error:', error.message);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixUserPassword();
