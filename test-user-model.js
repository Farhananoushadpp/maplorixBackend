// Test User model in API context
import mongoose from 'mongoose';
import User from './models/User.js';

async function testUserModel() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
        console.log('✅ Connected to MongoDB');

        // Test using User model (like the API does)
        console.log('\n🔍 Testing User.findOne...');
        const user = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
        console.log('User found with model:', !!user);
        
        if (user) {
            console.log('User email:', user.email);
            console.log('User active:', user.isActive);
            console.log('Password exists:', !!user.password);
        } else {
            console.log('User not found with model');
            
            // Try without select
            const userNoSelect = await User.findOne({ email: 'john.doe@company.com' });
            console.log('User found without select:', !!userNoSelect);
            
            // Try with different query
            const allUsers = await User.find({});
            console.log('All users with model:', allUsers.length);
            allUsers.forEach(u => console.log('  -', u.email));
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testUserModel();
