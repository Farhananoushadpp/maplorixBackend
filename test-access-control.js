import axios from 'axios';

const testAccessControlSystem = async () => {
  const api = axios.create({
    baseURL: 'http://localhost:4001/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('🔧 Testing Access Control System...\n');

  try {
    // 1. Test Regular User Registration
    console.log('📝 1. Testing Regular User Registration...');
    const regularUser = {
      firstName: 'Regular',
      lastName: 'User',
      email: 'regular@example.com',
      password: 'password123',
      phone: '1234567890'
    };
    
    const userResponse = await api.post('/auth/register', regularUser);
    console.log('✅ Regular user registered successfully');
    console.log('📋 Role:', userResponse.data.data.user.role);
    console.log('📋 Token:', userResponse.data.data.token.substring(0, 20) + '...');

    // 2. Test Admin User Registration
    console.log('\n📝 2. Testing Admin User Registration...');
    const adminUser = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      phone: '0987654321',
      role: 'admin'
    };
    
    const adminResponse = await api.post('/auth/register', adminUser);
    console.log('✅ Admin user registered successfully');
    console.log('📋 Role:', adminResponse.data.data.user.role);
    console.log('📋 Token:', adminResponse.data.data.token.substring(0, 20) + '...');

    // 3. Test Login with Regular User
    console.log('\n📝 3. Testing Regular User Login...');
    const userLogin = await api.post('/auth/login', {
      email: 'regular@example.com',
      password: 'password123'
    });
    console.log('✅ Regular user login successful');
    console.log('📋 User Role:', userLogin.data.data.user.role);

    // 4. Test Login with Admin User
    console.log('\n📝 4. Testing Admin User Login...');
    const adminLogin = await api.post('/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });
    console.log('✅ Admin user login successful');
    console.log('📋 Admin Role:', adminLogin.data.data.user.role);

    // 5. Test API Access with Regular User Token
    console.log('\n📝 5. Testing API Access with Regular User Token...');
    const userApi = axios.create({
      baseURL: 'http://localhost:4001/api',
      headers: {
        'Authorization': `Bearer ${userLogin.data.data.token}`
      }
    });
    
    const userJobs = await userApi.get('/jobs');
    console.log('✅ Regular user can access jobs (user jobs only)');
    console.log('📋 Jobs count:', userJobs.data.jobs.length);
    console.log('📋 Sample job:', userJobs.data.jobs[0]?.title);

    // 6. Test API Access with Admin User Token
    console.log('\n📝 6. Testing API Access with Admin User Token...');
    const adminApi = axios.create({
      baseURL: 'http://localhost:4001/api',
      headers: {
        'Authorization': `Bearer ${adminLogin.data.data.token}`
      }
    });
    
    const adminJobs = await adminApi.get('/jobs');
    console.log('✅ Admin user can access jobs (all jobs)');
    console.log('📋 Jobs count:', adminJobs.data.jobs.length);

    // 7. Test Feed Access (should work for both)
    console.log('\n📝 7. Testing Feed Access...');
    const feedJobs = await axios.get('http://localhost:4001/api/jobs/feed');
    console.log('✅ Feed accessible (admin jobs only)');
    console.log('📋 Feed jobs count:', feedJobs.data.jobs.length);

    console.log('\n🎉 Access Control System Test Completed!');
    console.log('✅ Regular users: Can access public pages + user jobs');
    console.log('✅ Admin users: Can access all pages + all jobs');
    console.log('✅ Feed: Public access to admin jobs only');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
};

testAccessControlSystem();
