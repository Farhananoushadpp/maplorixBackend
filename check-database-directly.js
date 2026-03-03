import mongoose from 'mongoose';

const checkDatabaseDirectly = async () => {
  try {
    console.log('🔧 Connecting to database directly...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/maplorix');
    console.log('✅ Connected to MongoDB');
    
    // Get the jobs collection
    const db = mongoose.connection.db;
    const jobsCollection = db.collection('jobs');
    
    // Count all documents
    const totalCount = await jobsCollection.countDocuments();
    console.log(`📋 Total documents in jobs collection: ${totalCount}`);
    
    // Find admin jobs
    const adminJobs = await jobsCollection.find({ postedBy: 'admin' }).toArray();
    console.log(`📋 Admin jobs in database: ${adminJobs.length}`);
    
    if (adminJobs.length > 0) {
      console.log('📋 Admin job details:');
      adminJobs.forEach((job, index) => {
        console.log(`  Admin Job ${index + 1}:`, {
          _id: job._id,
          title: job.title,
          postedBy: job.postedBy,
          isActive: job.isActive,
          createdAt: job.createdAt
        });
      });
    }
    
    // Find recent jobs
    const recentJobs = await jobsCollection.find({}).sort({ createdAt: -1 }).limit(5).toArray();
    console.log('\n📋 Most recent 5 jobs:');
    recentJobs.forEach((job, index) => {
      console.log(`  Job ${index + 1}: ${job.title} (postedBy: ${job.postedBy}, isActive: ${job.isActive})`);
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
};

checkDatabaseDirectly();
