import mongoose from 'mongoose';
import Application from './models/Application.js';

const checkApplicationDatabase = async () => {
  try {
    console.log('🔍 Checking application database directly...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('✅ Connected to database');
    
    // Find the specific application
    const targetApplication = await Application.findOne({ 
      email: 'dfgg@gmail.com',
      fullName: 'wwgeg'
    });
    
    if (targetApplication) {
      console.log('📄 Raw Database Document:');
      console.log('- _id:', targetApplication._id);
      console.log('- fullName:', targetApplication.fullName);
      console.log('- email:', targetApplication.email);
      console.log('- phone:', targetApplication.phone);
      console.log('- jobRole:', targetApplication.jobRole);
      console.log('- experience:', targetApplication.experience);
      console.log('- expectedSalary:', targetApplication.expectedSalary);
      console.log('- coverLetter:', targetApplication.coverLetter);
      console.log('- skills:', targetApplication.skills);
      console.log('- location:', targetApplication.location);
      console.log('- currentCompany:', targetApplication.currentCompany);
      console.log('- currentDesignation:', targetApplication.currentDesignation);
      console.log('- salaryNegotiable:', targetApplication.salaryNegotiable);
      console.log('- status:', targetApplication.status);
      
      console.log('\n🔍 Document Object Keys:');
      console.log(Object.keys(targetApplication.toObject()));
      
      console.log('\n🔍 Full Document:');
      console.log(JSON.stringify(targetApplication.toObject(), null, 2));
      
    } else {
      console.log('❌ Target application not found');
      
      // Show all applications
      const allApplications = await Application.find({});
      console.log(`\n📊 Found ${allApplications.length} applications:`);
      
      allApplications.forEach((app, index) => {
        console.log(`\n${index + 1}. Application: "${app.fullName}"`);
        console.log(`   - Email: ${app.email}`);
        console.log(`   - Job Role: ${app.jobRole}`);
        console.log(`   - Experience: ${app.experience}`);
        console.log(`   - Expected Salary: ${app.expectedSalary ? JSON.stringify(app.expectedSalary) : 'No data'}`);
        console.log(`   - Cover Letter: ${app.coverLetter ? 'Has data' : 'No data'}`);
        console.log(`   - Skills: ${app.skills || 'No data'}`);
        console.log(`   - Location: ${app.location || 'No data'}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

checkApplicationDatabase();
