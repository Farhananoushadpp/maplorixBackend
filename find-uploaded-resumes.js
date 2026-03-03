import fs from 'fs';
import path from 'path';

const findUploadedResumes = () => {
  try {
    // The resume upload directory
    const uploadsDir = 'C:\\Users\\USER-ID\\CascadeProjects\\maplorixBackend\\uploads\\resumes';
    
    console.log('🔍 Looking for uploaded resumes in:', uploadsDir);
    
    // Check if directory exists
    if (fs.existsSync(uploadsDir)) {
      console.log('✅ Uploads directory found!');
      
      // List all files in the directory
      const files = fs.readdirSync(uploadsDir);
      
      if (files.length > 0) {
        console.log(`📄 Found ${files.length} resume files:`);
        
        files.forEach((file, index) => {
          const filePath = path.join(uploadsDir, file);
          const stats = fs.statSync(filePath);
          
          console.log(`${index + 1}. ${file}`);
          console.log(`   Size: ${stats.size} bytes`);
          console.log(`   Created: ${stats.birthtime.toLocaleString()}`);
          console.log(`   Full path: ${filePath}`);
          console.log('');
        });
        
        console.log('🎯 Your uploaded CVs are stored in the uploads/resumes directory!');
        console.log('📁 You can find them at:', uploadsDir);
        
      } else {
        console.log('❌ No resume files found in the uploads directory');
        console.log('🔧 This might mean:');
        console.log('   - No resumes have been uploaded yet');
        console.log('   - The uploads directory was recently created');
        console.log('   - Resume uploads are not working properly');
      }
      
    } else {
      console.log('❌ Uploads directory not found!');
      console.log('🔧 Creating the uploads directory...');
      
      // Create the directory
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Uploads directory created:', uploadsDir);
      console.log('📁 Now resume uploads should work properly!');
    }
    
  } catch (error) {
    console.error('❌ Error finding uploaded resumes:', error);
  }
};

findUploadedResumes();
