// Debug user creation and lookup
import mongoose from 'mongoose';
import User from './models/User.js';

async function debugUserCreation() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
        console.log('✅ Connected to MongoDB');

        // Check existing users
        const existingUsers = await User.find({});
        console.log('\n📊 Existing users:', existingUsers.length);
        existingUsers.forEach(user => {
            console.log(`  - ${user.email} (${user.role})`);
        });

        // Delete and recreate
        await User.deleteOne({ email: 'john.doe@company.com' });
        console.log('\n🗑️ Deleted existing user');

        // Create new user
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
        console.log('✅ User saved');

        // Verify user exists
        const verifyUser = await User.findOne({ email: 'john.doe@company.com' });
        console.log('🔍 User verification:', !!verifyUser);
        if (verifyUser) {
            console.log('  Email:', verifyUser.email);
            console.log('  Active:', verifyUser.isActive);
            console.log('  Role:', verifyUser.role);
        }

        // Test lookup with password
        const userWithPassword = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
        console.log('🔍 User with password:', !!userWithPassword);
        if (userWithPassword) {
            console.log('  Password exists:', !!userWithPassword.password);
            console.log('  Password length:', userWithPassword.password.length);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugUserCreation();
