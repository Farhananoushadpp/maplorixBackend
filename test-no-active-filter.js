import axios from 'axios';

const testWithoutActiveFilter = async () => {
  try {
    console.log('🔧 Testing without active filter...');
    
    // Test without any active filter
    console.log('\n📋 Test: No active filter');
    const response1 = await axios.get('http://localhost:4000/api/jobs?limit=100');
    console.log(`Jobs count: ${response1.data.jobs?.length || 0}`);
    console.log('postedBy values:', [...new Set(response1.data.jobs?.map(j => j.postedBy) || [])]);
    
    // Test with active=false
    console.log('\n📋 Test: active=false');
    const response2 = await axios.get('http://localhost:4000/api/jobs?active=false&limit=100');
    console.log(`Jobs count: ${response2.data.jobs?.length || 0}`);
    console.log('postedBy values:', [...new Set(response2.data.jobs?.map(j => j.postedBy) || [])]);
    
    // Test with active=true
    console.log('\n📋 Test: active=true');
    const response3 = await axios.get('http://localhost:4000/api/jobs?active=true&limit=100');
    console.log(`Jobs count: ${response3.data.jobs?.length || 0}`);
    console.log('postedBy values:', [...new Set(response3.data.jobs?.map(j => j.postedBy) || [])]);
    
    // Test with no active parameter (should use default active=true)
    console.log('\n📋 Test: No active parameter (default)');
    const response4 = await axios.get('http://localhost:4000/api/jobs?limit=100&sortBy=createdAt&sortOrder=desc');
    console.log(`Jobs count: ${response4.data.jobs?.length || 0}`);
    console.log('postedBy values:', [...new Set(response4.data.jobs?.map(j => j.postedBy) || [])]);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testWithoutActiveFilter();
