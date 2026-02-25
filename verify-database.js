import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const verifyDatabase = async () => {
  try {
    console.log("🔍 MongoDB Database Verification Tool");
    console.log("=====================================\n");

    // Get connection details
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/maplorix";
    const dbName = mongoURI.split('/').pop().split('?')[0];
    
    console.log("📍 Connection URI:", mongoURI);
    console.log("🎯 Target Database:", dbName);
    console.log("");

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    
    console.log("✅ Connected to MongoDB");
    console.log("🗄️ Active Database:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);
    console.log("");

    // Get database admin interface
    const admin = mongoose.connection.db.admin();
    
    // List all databases
    console.log("📋 All Databases on Server:");
    const databases = await admin.listDatabases();
    databases.databases.forEach(db => {
      const marker = db.name === dbName ? "👉" : "  ";
      console.log(`${marker} ${db.name} (${db.sizeOnDisk ? Math.round(db.sizeOnDisk / 1024 / 1024) + 'MB' : 'empty'})`);
    });
    console.log("");

    // List collections in our target database
    const db = mongoose.connection.db;
    console.log(`📚 Collections in "${dbName}" database:`);
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log("   (No collections found - database is empty)");
    } else {
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`   📄 ${collection.name} (${count} documents)`);
      }
    }
    console.log("");

    // Check for documents in Jobs and Applications collections
    console.log("🔍 Checking specific collections:");
    
    try {
      const jobsCount = await db.collection('jobs').countDocuments();
      console.log(`   💼 Jobs Collection: ${jobsCount} documents`);
      
      if (jobsCount > 0) {
        const sampleJob = await db.collection('jobs').findOne();
        console.log(`      Sample Job: "${sampleJob?.title}" at ${sampleJob?.company}`);
      }
    } catch (error) {
      console.log("   💼 Jobs Collection: Not found or error");
    }
    
    try {
      const applicationsCount = await db.collection('applications').countDocuments();
      console.log(`   📝 Applications Collection: ${applicationsCount} documents`);
      
      if (applicationsCount > 0) {
        const sampleApp = await db.collection('applications').findOne();
        console.log(`      Sample Application: "${sampleApp?.fullName}" for ${sampleApp?.jobRole}`);
      }
    } catch (error) {
      console.log("   📝 Applications Collection: Not found or error");
    }
    console.log("");

    // Verify we're using the correct database
    if (mongoose.connection.name === dbName) {
      console.log("✅ SUCCESS: Connected to correct database");
    } else {
      console.log("❌ ERROR: Database name mismatch");
      console.log("   Expected:", dbName);
      console.log("   Actual:", mongoose.connection.name);
    }
    
    console.log("");
    console.log("🎯 Recommendations:");
    
    if (collections.length === 0) {
      console.log("   - Database is empty. Try creating some jobs/applications.");
    }
    
    if (mongoose.connection.name !== dbName) {
      console.log("   - Update your .env file MONGODB_URI to use the correct database");
    }
    
    // Check for alternative databases
    const altDatabases = databases.databases.filter(db => 
      db.name.includes('maplorix') && db.name !== dbName
    );
    
    if (altDatabases.length > 0) {
      console.log("   ⚠️  Found alternative databases:");
      altDatabases.forEach(db => {
        console.log(`      - ${db.name} (${Math.round(db.sizeOnDisk / 1024 / 1024)}MB)`);
      });
      console.log("   - Consider if your data is in one of these databases");
    }

  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
};

// Run verification
verifyDatabase();
