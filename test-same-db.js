// Test using the same database connection as the server
import mongoose from 'mongoose';

async function testSameDBConnection() {
    try {
        // Use the same connection string as the server
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix';
        console.log('🔗 Connecting to:', mongoUri);
        
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check all users
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('\n👥 Users in database:', users.length);
        users.forEach(user => {
            console.log(`  - ${user.email} (${user.role}) - Active: ${user.isActive}`);
        });

        // Check if our test user exists
        const testUser = users.find(u => u.email === 'john.doe@company.com');
        console.log('\n🔍 Test user found:', !!testUser);

        if (testUser) {
            console.log('  User ID:', testUser._id);
            console.log('  Active:', testUser.isActive);
            console.log('  Has password:', !!testUser.password);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSameDBConnection();
