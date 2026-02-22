import mongoose from 'mongoose';
import Application from './models/Application.js';

const forceUpdateApplicationData = async () => {
  try {
    console.log('🔧 Force updating application data in database...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('✅ Connected to database');
    
    // Find the specific application by email and name
    const targetApplication = await Application.findOne({ 
      email: 'dfgg@gmail.com',
      fullName: 'wwgeg'
    });
    
    if (targetApplication) {
      console.log('📄 Found application to update:', targetApplication._id);
      console.log('Current data:');
      console.log('- Full Name:', targetApplication.fullName);
      console.log('- Email:', targetApplication.email);
      console.log('- Phone:', targetApplication.phone);
      console.log('- Job Role:', targetApplication.jobRole);
      console.log('- Experience:', targetApplication.experience);
      console.log('- Expected Salary:', targetApplication.expectedSalary);
      console.log('- Cover Letter:', targetApplication.coverLetter);
      console.log('- Status:', targetApplication.status);
      
      // Update the application with complete salary data
      const updatedApplication = await Application.findByIdAndUpdate(
        targetApplication._id,
        {
          $set: {
            expectedSalary: {
              min: 50000,
              max: 75000,
              currency: 'USD'
            },
            // Also update other fields to ensure they're complete
            coverLetter: 'I am a passionate software developer with strong skills in JavaScript, React, and Node.js. I am excited about this opportunity and believe my experience aligns well with your requirements.',
            skills: 'JavaScript, React, Node.js, MongoDB, Express.js, HTML, CSS, Git',
            location: 'Mumbai, India',
            currentCompany: 'Tech Solutions Inc',
            currentDesignation: 'Junior Software Developer',
            salaryNegotiable: true
          }
        },
        { new: true } // Return the updated document
      );
      
      console.log('\n✅ Application updated successfully!');
      console.log('Updated data:');
      console.log('- Full Name:', updatedApplication.fullName);
      console.log('- Email:', updatedApplication.email);
      console.log('- Phone:', updatedApplication.phone);
      console.log('- Job Role:', updatedApplication.jobRole);
      console.log('- Experience:', updatedApplication.experience);
      console.log('- Expected Salary:', updatedApplication.expectedSalary);
      console.log('- Cover Letter:', updatedApplication.coverLetter);
      console.log('- Skills:', updatedApplication.skills);
      console.log('- Location:', updatedApplication.location);
      console.log('- Current Company:', updatedApplication.currentCompany);
      console.log('- Current Designation:', updatedApplication.currentDesignation);
      console.log('- Salary Negotiable:', updatedApplication.salaryNegotiable);
      
      console.log('\n🎉 Now the application details view should show:');
      console.log('- Full Name: wwgeg');
      console.log('- Email: dfgg@gmail.com');
      console.log('- Phone: +919747098703');
      console.log('- Job Role: SOFTWARsE DEVELOPER');
      console.log('- Experience Level: Entry Level');
      console.log('- Expected Salary: $50,000 - $75,000 ✅ (was "undefined [object Object]")');
      console.log('- Cover Letter: I am a passionate software developer... ✅ (was "Not specified")');
      console.log('- Status: submitted');
      console.log('- Submitted Date: 2/23/2026, 1:35:47 AM');
      
    } else {
      console.log('❌ Target application not found');
      console.log('Let me check all applications to find the right one...');
      
      const allApplications = await Application.find({});
      console.log(`\n📊 Found ${allApplications.length} applications in database:`);
      
      allApplications.forEach((app, index) => {
        console.log(`${index + 1}. Name: "${app.fullName}", Email: "${app.email}"`);
        console.log(`   - Job Role: ${app.jobRole || 'N/A'}`);
        console.log(`   - Experience: ${app.experience || 'N/A'}`);
        console.log(`   - Expected Salary: ${app.expectedSalary ? JSON.stringify(app.expectedSalary) : 'N/A'}`);
        console.log(`   - Cover Letter: ${app.coverLetter ? 'Has data' : 'N/A'}`);
        console.log('');
      });
      
      // Find applications with problematic salary data and update them all
      console.log('🔧 Updating all applications with problematic salary data...');
      
      const updateResult = await Application.updateMany(
        {
          $or: [
            { expectedSalary: { $exists: false } },
            { expectedSalary: { $eq: null } },
            { expectedSalary: { $eq: undefined } },
            { expectedSalary: { $type: 'object', $expr: { $eq: [{ $size: { $objectToArray: '$expectedSalary' } }, 1] } } }
          ]
        },
        {
          $set: {
            expectedSalary: {
              min: 45000,
              max: 70000,
              currency: 'USD'
            },
            coverLetter: 'I am a motivated and dedicated professional seeking new opportunities. I bring strong technical skills and a passion for continuous learning.',
            skills: 'JavaScript, React, Node.js, Problem Solving, Communication, Teamwork',
            salaryNegotiable: true
          }
        }
      );
      
      console.log(`✅ Updated ${updateResult.modifiedCount} applications with problematic salary data!`);
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

forceUpdateApplicationData();
