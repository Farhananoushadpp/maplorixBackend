// Debug the auth controller issue
import mongoose from 'mongoose';
import User from './models/User.js';

async function debugAuthController() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
        console.log('✅ Connected to MongoDB');

        // Get the user
        const user = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
        
        if (user) {
            console.log('👤 User found:');
            console.log('  Email:', user.email);
            console.log('  Role:', user.role);
            console.log('  Active:', user.isActive);
            console.log('  Department:', user.department);
            console.log('  Password exists:', !!user.password);
            console.log('  Password length:', user.password.length);
            
            // Test password comparison
            const isMatch = await user.comparePassword('password123');
            console.log('  Password match:', isMatch);
            
            // Test the exact same logic as auth controller
            console.log('\n🔍 Testing auth controller logic...');
            
            // Step 1: Find user with password (like auth controller)
            const userWithPassword = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
            
            if (!userWithPassword) {
                console.log('❌ User not found (should not happen)');
                return;
            }
            
            console.log('✅ User found in auth controller logic');
            
            // Step 2: Check if active
            if (!userWithPassword.isActive) {
                console.log('❌ User is not active');
                return;
            }
            
            console.log('✅ User is active');
            
            // Step 3: Compare password
            const passwordMatch = await userWithPassword.comparePassword('password123');
            
            if (!passwordMatch) {
                console.log('❌ Password does not match');
                return;
            }
            
            console.log('✅ Password matches - Auth controller should work!');
            
            // Test the actual API endpoint with detailed logging
            console.log('\n🌐 Testing actual API with detailed logging...');
            
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

                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                
                const text = await response.text();
                console.log('Response body:', text);
                
                try {
                    const json = JSON.parse(text);
                    console.log('Parsed JSON:', json);
                } catch (e) {
                    console.log('Not valid JSON');
                }
                
            } catch (error) {
                console.error('API call error:', error.message);
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Debug error:', error.message);
    }
}

debugAuthController();
