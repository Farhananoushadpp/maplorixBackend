// Test with exact same format as frontend
import mongoose from 'mongoose';
import User from './models/User.js';

async function testExactFrontendFormat() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
        console.log('✅ Connected to MongoDB');

        // Test the exact same format the frontend sends
        const requestBody = JSON.stringify({
            email: 'john.doe@company.com',
            password: 'password123'
        });
        
        console.log('Request body:', requestBody);
        
        // Parse it back (like express.json() does)
        const parsedBody = JSON.parse(requestBody);
        console.log('Parsed body:', parsedBody);
        
        const { email, password } = parsedBody;
        console.log('Extracted email:', email);
        console.log('Extracted password:', password);
        
        // Now test the exact auth controller logic
        console.log('\n🔍 Testing exact auth controller flow...');
        
        // Find user and include password
        const user = await User.findOne({ email }).select('+password');
        console.log('User found:', !!user);
        
        if (!user) {
            console.log('❌ User not found');
            return;
        }
        
        console.log('✅ User found:', user.email);
        console.log('User active:', user.isActive);
        
        // Check if user is active
        if (!user.isActive) {
            console.log('❌ User is not active');
            return;
        }
        
        console.log('✅ User is active');
        
        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        console.log('Password valid:', isPasswordValid);
        
        if (!isPasswordValid) {
            console.log('❌ Password is invalid');
            return;
        }
        
        console.log('✅ Password is valid - Login should succeed!');
        
        // Test with different email case
        console.log('\n🔍 Testing with different email case...');
        const user2 = await User.findOne({ email: 'John.Doe@company.com' }).select('+password');
        console.log('Found with uppercase:', !!user2);
        
        // Test with extra spaces
        console.log('\n🔍 Testing with extra spaces...');
        const user3 = await User.findOne({ email: 'john.doe@company.com ' }).select('+password');
        console.log('Found with trailing space:', !!user3);
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testExactFrontendFormat();
