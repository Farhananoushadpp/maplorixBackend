import axios from 'axios';

const testDashboardUpdates = async () => {
  try {
    console.log('🔍 Testing dashboard with salary formatting...');
    
    // Get applications data
    const response = await axios.get('http://localhost:4000/api/applications', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTliMjFiZDA3NWJiYTYxN2I1NzNhZDUiLCJpYXQiOjE3NzE3ODkzNTMsImV4cCI6MTc3MjM5NDE1M30.WRAs_do3Gl4-CGq2TrFLdwzeAfXOzl6RCaFmq_rJ8QA'
      }
    });
    
    const applications = response.data.data.applications;
    
    console.log(`📊 Found ${applications.length} applications`);
    
    // Test salary formatting for each application
    applications.forEach((app, index) => {
      console.log(`\n📄 Application ${index + 1}:`);
      console.log(`- Name: ${app.fullName || 'N/A'}`);
      console.log(`- Email: ${app.email || 'N/A'}`);
      console.log(`- Phone: ${app.phone || 'N/A'}`);
      console.log(`- Job Role: ${app.jobRole || 'N/A'}`);
      console.log(`- Experience: ${app.experience || 'N/A'}`);
      console.log(`- Expected Salary (raw):`, app.expectedSalary);
      
      // Apply the same formatting logic as in the component
      const formatSalary = (salary) => {
        if (!salary) return 'Not specified';
        
        if (typeof salary === 'string') {
          try {
            salary = JSON.parse(salary);
          } catch (e) {
            return salary;
          }
        }
        
        if (typeof salary === 'object' && salary !== null) {
          const { min, max, currency = 'USD' } = salary;
          
          if (min && max) {
            const formatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
            return `${formatter.format(min)} - ${formatter.format(max)}`;
          } else if (min) {
            const formatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
            return `${formatter.format(min)}+`;
          } else if (max) {
            const formatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
            return `Up to ${formatter.format(max)}`;
          } else if (currency) {
            return currency;
          }
        }
        
        return 'Not specified';
      };
      
      console.log(`- Expected Salary (formatted): ${formatSalary(app.expectedSalary)}`);
      console.log(`- Status: ${app.status || 'N/A'}`);
      console.log(`- Submitted: ${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}`);
    });
    
    console.log('\n✅ Dashboard salary formatting test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testDashboardUpdates();
