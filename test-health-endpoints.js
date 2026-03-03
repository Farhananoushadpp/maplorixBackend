import axios from 'axios';

const testHealthEndpoints = async () => {
  const ports = [4001, 4000];
  const endpoints = ['/health', '/api/health', '/', '/api'];
  
  for (const port of ports) {
    console.log(`\n🔧 Testing port ${port}:`);
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:${port}${endpoint}`, { timeout: 1000 });
        console.log(`  ✅ ${endpoint} - Status: ${response.status}`);
      } catch (error) {
        console.log(`  ❌ ${endpoint} - Error: ${error.message}`);
      }
    }
  }
};

testHealthEndpoints();
