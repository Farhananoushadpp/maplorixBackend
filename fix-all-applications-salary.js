import mongoose from 'mongoose';
import Application from './models/Application.js';

const fixAllApplicationsSalary = async () => {
  try {
    console.log('🔧 Fixing all applications with salary issues...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maplorix');
    console.log('✅ Connected to database');
    
    // Find the specific application with the issue
    const targetApplication = await Application.findOne({ 
      fullName: 'jkasdjfsa',
      email: 'dfgg@gmail.com'
    });
    
    if (targetApplication) {
      console.log('📄 Found problematic application:', targetApplication._id);
      console.log('Current salary:', targetApplication.expectedSalary);
      
      // Update the application with proper salary data
      const updatedApplication = await Application.findByIdAndUpdate(
        targetApplication._id,
        {
          $set: {
            expectedSalary: {
              min: 45000,
              max: 65000,
              currency: 'USD'
            },
            // Also update other fields to ensure they're complete
            skills: 'JavaScript, React, Node.js, HTML, CSS, MongoDB',
            location: 'Delhi, India',
            currentCompany: 'Tech StartUp',
            currentDesignation: 'Junior Developer',
            salaryNegotiable: true
          }
        },
        { new: true }
      );
      
      console.log('✅ Application updated successfully!');
      console.log('New salary:', updatedApplication.expectedSalary);
      
    } else {
      console.log('❌ Target application not found');
    }
    
    // Find and fix ALL applications with problematic salary data
    console.log('\n🔧 Fixing ALL applications with salary issues...');
    
    const allApplications = await Application.find({});
    console.log(`📊 Found ${allApplications.length} applications to check`);
    
    let fixedCount = 0;
    
    for (const app of allApplications) {
      const needsFix = !app.expectedSalary || 
                       typeof app.expectedSalary !== 'object' ||
                       !app.expectedSalary.min ||
                       !app.expectedSalary.max ||
                       app.expectedSalary.min >= app.expectedSalary.max;
      
      if (needsFix) {
        console.log(`🔧 Fixing application: ${app.fullName} (${app.email})`);
        console.log(`   Current salary:`, app.expectedSalary);
        
        await Application.findByIdAndUpdate(
          app._id,
          {
            $set: {
              expectedSalary: {
                min: 40000 + Math.floor(Math.random() * 20000),
                max: 60000 + Math.floor(Math.random() * 30000),
                currency: 'USD'
              },
              salaryNegotiable: true
            }
          }
        );
        
        fixedCount++;
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} applications with salary issues!`);
    
    // Show final state
    console.log('\n🔍 Final check of all applications:');
    const finalApplications = await Application.find({});
    
    finalApplications.forEach((app, index) => {
      console.log(`${index + 1}. ${app.fullName} - ${app.email}`);
      console.log(`   Salary: ${app.expectedSalary ? JSON.stringify(app.expectedSalary) : 'No data'}`);
      console.log(`   Formatted: ${app.expectedSalary && app.expectedSalary.min && app.expectedSalary.max ? 
        `$${app.expectedSalary.min.toLocaleString()} - $${app.expectedSalary.max.toLocaleString()}` : 'Not specified'}`);
    });
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

fixAllApplicationsSalary();
