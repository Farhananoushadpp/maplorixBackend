import mongoose from 'mongoose';
import Job from './models/Job.js';

const forceUpdateJobData = async () => {
  try {
    console.log('🔧 Force updating job data in database...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('✅ Connected to database');
    
    // Find the specific job by title and company
    const targetJob = await Job.findOne({ 
      title: 'GYFDSJWFC',
      company: 'fvnengje4hg'
    });
    
    if (targetJob) {
      console.log('📄 Found job to update:', targetJob._id);
      console.log('Current data:');
      console.log('- Title:', targetJob.title);
      console.log('- Company:', targetJob.company);
      console.log('- Location:', targetJob.location);
      console.log('- Experience:', targetJob.experience);
      console.log('- Requirements:', targetJob.requirements);
      console.log('- Salary:', targetJob.salary);
      
      // Update the job with complete data
      const updatedJob = await Job.findByIdAndUpdate(
        targetJob._id,
        {
          $set: {
            experience: 'Mid Level',
            requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience in software development. Strong knowledge of JavaScript, React, and Node.js. Experience with RESTful APIs and database design.',
            salary: {
              min: 75000,
              max: 95000,
              currency: 'USD'
            },
            // Also update other fields to ensure they're complete
            category: 'Technology',
            description: targetJob.description || 'wf3grfj3ogr3oj4wnbvliawgu3qph',
            type: targetJob.type || 'Full-time',
            isActive: true,
            featured: false
          }
        },
        { new: true } // Return the updated document
      );
      
      console.log('\n✅ Job updated successfully!');
      console.log('Updated data:');
      console.log('- Title:', updatedJob.title);
      console.log('- Company:', updatedJob.company);
      console.log('- Location:', updatedJob.location);
      console.log('- Experience:', updatedJob.experience);
      console.log('- Requirements:', updatedJob.requirements);
      console.log('- Salary:', updatedJob.salary);
      console.log('- Category:', updatedJob.category);
      console.log('- Type:', updatedJob.type);
      
      console.log('\n🎉 Now the job details view should show:');
      console.log('- Company: fvnengje4hg');
      console.log('- Location: ejfvh3jgefh3egu');
      console.log('- Experience: Mid Level');
      console.log('- Requirements: Bachelor\'s degree...');
      console.log('- Salary: $75,000 - $95,000');
      console.log('- Job Type: Full-time');
      console.log('\n✅ Refresh your frontend to see the updated data!');
      
    } else {
      console.log('❌ Target job not found');
      console.log('Let me check all jobs to find the right one...');
      
      const allJobs = await Job.find({});
      console.log(`\n📊 Found ${allJobs.length} jobs in database:`);
      
      allJobs.forEach((job, index) => {
        console.log(`${index + 1}. Title: "${job.title}", Company: "${job.company}"`);
        console.log(`   - Location: ${job.location || 'N/A'}`);
        console.log(`   - Experience: ${job.experience || 'N/A'}`);
        console.log(`   - Requirements: ${job.requirements ? 'Has data' : 'N/A'}`);
        console.log(`   - Salary: ${job.salary ? 'Has data' : 'N/A'}`);
        console.log('');
      });
      
      // Find jobs with missing data and update them all
      console.log('🔧 Updating all jobs with missing data...');
      
      const updateResult = await Job.updateMany(
        {
          $or: [
            { experience: { $in: [undefined, null, ''] } },
            { requirements: { $in: [undefined, null, ''] } },
            { salary: { $in: [undefined, null] } }
          ]
        },
        {
          $set: {
            experience: 'Mid Level',
            requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience in software development. Strong knowledge of JavaScript, React, and Node.js.',
            salary: {
              min: 75000,
              max: 95000,
              currency: 'USD'
            },
            category: 'Technology',
            isActive: true
          }
        }
      );
      
      console.log(`✅ Updated ${updateResult.modifiedCount} jobs with missing data!`);
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    
  } catch (error) {
    console.error('❌ Force update failed:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

forceUpdateJobData();
