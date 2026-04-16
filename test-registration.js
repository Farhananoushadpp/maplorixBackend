// Test script to demonstrate real user registration
import axios from 'axios';

const testRegistration = async () => {
  try {
    console.log('Testing real user registration...\n');
    
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe.real@example.com',
      password: 'password123',
      phone: '+1234567890',
      message: 'I want to register as a job seeker'
    };
    
    console.log('Registering new user:');
    console.log('Name:', newUser.firstName, newUser.lastName);
    console.log('Email:', newUser.email);
    console.log('Password:', newUser.password);
    console.log('Phone:', newUser.phone);
    console.log('');
    
    const response = await axios.post('http://localhost:4001/api/auth/register', newUser);
    
    console.log('Registration Response:');
    console.log('Status:', response.status);
    console.log('Message:', response.data.message);
    console.log('User Role:', response.data.data.user.role);
    console.log('Redirect To:', response.data.data.routing.redirectTo);
    console.log('Token Generated:', !!response.data.data.token);
    console.log('');
    
    // Test login with the new user
    console.log('Testing login with new credentials...');
    const loginResponse = await axios.post('http://localhost:4001/api/auth/login', {
      email: newUser.email,
      password: newUser.password
    });
    
    console.log('Login Response:');
    console.log('Status:', loginResponse.status);
    console.log('Message:', loginResponse.data.message);
    console.log('User Name:', loginResponse.data.data.user.fullName);
    console.log('Role:', loginResponse.data.data.user.role);
    console.log('Is Admin:', loginResponse.data.data.routing.isAdmin);
    
    console.log('\n\u2702 Real user registration and login working successfully!');
    
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('User already exists or validation error:', error.response.data.message);
    } else {
      console.error('Registration test failed:', error.message);
    }
  }
};

testRegistration();
