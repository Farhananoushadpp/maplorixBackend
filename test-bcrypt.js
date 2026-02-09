// Test bcrypt directly without mongoose
import bcrypt from 'bcryptjs';

async function testBcryptDirectly() {
    console.log('🧪 Testing bcrypt directly...');
    
    const password = 'password123';
    
    try {
        // Test 1: Create hash
        console.log('\n1️⃣ Creating hash...');
        const hash = await bcrypt.hash(password, 12);
        console.log('Hash created:', hash);
        console.log('Hash length:', hash.length);
        
        // Test 2: Compare with correct password
        console.log('\n2️⃣ Testing correct password...');
        const match1 = await bcrypt.compare(password, hash);
        console.log('Correct password match:', match1);
        
        // Test 3: Compare with wrong password
        console.log('\n3️⃣ Testing wrong password...');
        const match2 = await bcrypt.compare('wrongpassword', hash);
        console.log('Wrong password match:', match2);
        
        // Test 4: Multiple rounds
        console.log('\n4️⃣ Testing multiple rounds...');
        for (let rounds = 10; rounds <= 12; rounds++) {
            const testHash = await bcrypt.hash(password, rounds);
            const testMatch = await bcrypt.compare(password, testHash);
            console.log(`Rounds ${rounds}: ${testMatch ? 'SUCCESS' : 'FAILED'}`);
        }
        
        // Test 5: Check bcrypt version
        console.log('\n5️⃣ Bcrypt info...');
        console.log('Bcrypt version:', bcrypt.version || 'Unknown');
        
    } catch (error) {
        console.error('❌ Bcrypt test failed:', error);
    }
}

testBcryptDirectly();
