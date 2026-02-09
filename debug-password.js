// Debug password issue step by step
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

async function debugPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
        console.log('✅ Connected to MongoDB');

        const password = 'password123';
        
        // Step 1: Create a hash manually
        console.log('\n🔐 Step 1: Creating manual hash...');
        const manualHash = await bcrypt.hash(password, 12);
        console.log('Manual hash:', manualHash);
        
        // Step 2: Test manual hash
        console.log('\n🔍 Step 2: Testing manual hash...');
        const manualMatch = await bcrypt.compare(password, manualHash);
        console.log('Manual hash match:', manualMatch);

        // Step 3: Check what's in database
        console.log('\n📊 Step 3: Checking database...');
        const dbUser = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
        
        if (dbUser) {
            console.log('DB User found:', dbUser.email);
            console.log('DB Password hash:', dbUser.password);
            console.log('Password exists:', !!dbUser.password);
            console.log('Password length:', dbUser.password.length);
            
            // Step 4: Test DB hash directly
            console.log('\n🔍 Step 4: Testing DB hash directly...');
            const dbMatch = await bcrypt.compare(password, dbUser.password);
            console.log('DB hash match:', dbMatch);
            
            // Step 5: Test using model method
            console.log('\n🔍 Step 5: Testing using model method...');
            const methodMatch = await dbUser.comparePassword(password);
            console.log('Method match:', methodMatch);
            
            // Step 6: Test with wrong password
            console.log('\n🔍 Step 6: Testing with wrong password...');
            const wrongMatch = await dbUser.comparePassword('wrongpassword');
            console.log('Wrong password match:', wrongMatch);
            
            // Step 7: Create fresh user and test immediately
            console.log('\n🔧 Step 7: Creating fresh user...');
            await User.deleteOne({ email: 'john.doe@company.com' });
            
            const freshHash = await bcrypt.hash(password, 12);
            console.log('Fresh hash:', freshHash);
            
            const freshUser = new User({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@company.com',
                password: freshHash,
                role: 'admin',
                department: 'HR',
                isActive: true
            });
            
            await freshUser.save();
            console.log('Fresh user saved');
            
            // Test fresh user
            const savedFreshUser = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
            const freshMatch = await savedFreshUser.comparePassword(password);
            console.log('Fresh user match:', freshMatch);
            
            // Test API login with fresh user
            console.log('\n🌐 Step 8: Testing API with fresh user...');
            try {
                const response = await fetch('http://localhost:4000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'john.doe@company.com',
                        password: password
                    })
                });

                const result = await response.json();
                console.log('API Status:', response.status);
                console.log('API Success:', result.success);
                console.log('API Message:', result.message);
                
                if (result.success) {
                    console.log('🎉 SUCCESS! API login works!');
                    
                    // Test job posting
                    console.log('\n💼 Testing job posting...');
                    const token = result.data.token;
                    const jobData = {
                        title: 'Test Job from Debug',
                        company: 'Debug Company',
                        location: 'Remote',
                        type: 'Full-time',
                        category: 'Technology',
                        experience: 'Mid Level',
                        description: 'This is a test job created during debugging to verify the job posting functionality works correctly.',
                        requirements: 'Strong debugging skills and attention to detail.',
                        salary: {
                            min: 50000,
                            max: 70000,
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
                    } else {
                        console.log('❌ Job posting failed:', jobResult.message);
                    }
                }
            } catch (error) {
                console.error('API Error:', error.message);
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Debug error:', error.message);
    }
}

debugPassword();
