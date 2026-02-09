// Check existing users and create test user if needed
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

async function checkAndCreateUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
        console.log('✅ Connected to MongoDB');

        // Check existing users
        const users = await User.find({});
        console.log(`\n👥 Found ${users.length} users:`);
        users.forEach(user => {
            console.log(`  - ${user.fullName} (${user.email}) - ${user.role}`);
        });

        // Check if test user exists
        const testUser = await User.findOne({ email: 'john.doe@company.com' });
        
        if (!testUser) {
            console.log('\n🔧 Creating test user...');
            const hashedPassword = await bcrypt.hash('password123', 12);
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
            console.log('✅ Test user created successfully!');
            console.log('📧 Email: john.doe@company.com');
            console.log('🔑 Password: password123');
        } else {
            console.log('\n✅ Test user already exists');
            console.log('📧 Email:', testUser.email);
            console.log('👤 Role:', testUser.role);
            console.log('✅ Active:', testUser.isActive);
        }

        // Test password comparison
        console.log('\n🔐 Testing password...');
        const userForTest = await User.findOne({ email: 'john.doe@company.com' }).select('+password');
        const isMatch = await userForTest.comparePassword('password123');
        console.log('Password match:', isMatch ? 'SUCCESS' : 'FAILED');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkAndCreateUser();
