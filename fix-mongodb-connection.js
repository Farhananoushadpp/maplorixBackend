// Script to fix MongoDB connection on server
import mongoose from 'mongoose';

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection options...\n');
    
    // Test different connection strings
    const connectionStrings = [
      'mongodb://127.0.0.1:27017/maplorix',
      'mongodb://localhost:27017/maplorix',
      'mongodb://0.0.0.0:27017/maplorix'
    ];
    
    for (const connectionString of connectionStrings) {
      console.log(`Testing: ${connectionString}`);
      try {
        await mongoose.connect(connectionString, {
          serverSelectionTimeoutMS: 5000 // 5 second timeout
        });
        console.log('SUCCESS: Connected to MongoDB');
        console.log('Connection string:', connectionString);
        await mongoose.connection.close();
        return connectionString;
      } catch (error) {
        console.log('FAILED:', error.message);
      }
      console.log('---');
    }
    
    console.log('All connection attempts failed');
    return null;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
};

testConnection();
