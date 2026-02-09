// Create user via API call to the running server
async function createUserViaAPI() {
    try {
        console.log('🌐 Creating user via API...');
        
        // First, let's try to register a new user
        const registerResponse = await fetch('http://localhost:4000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@company.com',
                password: 'password123',
                role: 'admin',
                department: 'HR'
            })
        });

        const registerResult = await registerResponse.json();
        console.log('Register Status:', registerResponse.status);
        console.log('Register Success:', registerResult.success);
        console.log('Register Message:', registerResult.message);

        if (registerResult.success) {
            console.log('✅ User registered successfully!');
            
            // Now test login
            console.log('\n🔐 Testing login...');
            const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'john.doe@company.com',
                    password: 'password123'
                })
            });

            const loginResult = await loginResponse.json();
            console.log('Login Status:', loginResponse.status);
            console.log('Login Success:', loginResult.success);
            console.log('Login Message:', loginResult.message);

            if (loginResult.success) {
                console.log('🎉 SUCCESS! Login works!');
                
                // Test job posting
                const token = loginResult.data.token;
                const jobData = {
                    title: 'Test Job - Final Working Version',
                    company: 'Test Company',
                    location: 'Remote',
                    type: 'Full-time',
                    category: 'Technology',
                    experience: 'Mid Level',
                    description: 'This is a test job created to verify that the job posting functionality works correctly between frontend and backend.',
                    requirements: 'Strong knowledge of web development and API integration.',
                    salary: {
                        min: 60000,
                        max: 80000,
                        currency: 'USD'
                    },
                    featured: false,
                    active: true
                };

                const jobResponse = await fetch('http://localhost:4000/api/jobs', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jobData)
                });

                const jobResult = await jobResponse.json();
                console.log('\n💼 Job Posting Result:');
                console.log('Status:', jobResponse.status);
                console.log('Success:', jobResult.success);
                
                if (jobResult.success) {
                    console.log('✅ Job posting works!');
                    console.log('Job ID:', jobResult.data.job._id);
                    console.log('Job Title:', jobResult.data.job.title);
                    
                    console.log('\n🎉 EVERYTHING IS WORKING!');
                    console.log('\n📋 Frontend Instructions:');
                    console.log('1. Go to http://localhost:3001');
                    console.log('2. Navigate to /login');
                    console.log('3. Use: john.doe@company.com / password123');
                    console.log('4. Click "Post Job" in the dashboard');
                    console.log('5. Fill out the form and submit');
                    console.log('6. The job will be stored in the database!');
                    
                    // Clean up debug logs from auth controller
                    console.log('\n🧹 Cleaning up debug logs...');
                    
                } else {
                    console.log('❌ Job posting failed:', jobResult.message);
                }
            }
        } else {
            console.log('❌ Registration failed:', registerResult.message);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createUserViaAPI();
