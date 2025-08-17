// auth-test.js
// Improved authentication testing script with dynamic cookie extraction

const axios = require('axios');
const readline = require('readline');

const BASE_URL = 'http://localhost:5001';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Test authentication endpoints
async function testAuth() {
  console.log('🔑 Authentication Test Suite\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server connection...');
    const healthCheck = await axios.get(`${BASE_URL}/`);
    console.log('✅ Server is running:', healthCheck.data);

    // Test 2: Test unauthenticated access to protected route
    console.log('\n2️⃣ Testing unauthenticated access to protected route...');
    try {
      await axios.post(`${BASE_URL}/api/games`);
      console.log('❌ Protected route allowed unauthenticated access (this is bad!)');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Protected route correctly rejected unauthenticated access');
      } else {
        console.log('❓ Unexpected error:', error.message);
      }
    }

    // Test 3: Authentication flow instructions
    console.log('\n3️⃣ Manual Authentication Test');
    console.log('To test authentication:');
    console.log(`1. Open your browser and go to: ${BASE_URL}/auth/google`);
    console.log('2. Complete Google OAuth login');
    console.log('3. After login, open browser dev tools (F12)');
    console.log('4. Go to Application/Storage tab > Cookies');
    console.log(`5. Find the cookie for ${BASE_URL}`);
    console.log('6. Copy the value of "connect.sid" cookie');
    console.log('7. Paste it here when prompted\n');

    const sessionCookie = await prompt('Enter your session cookie value (or "skip" to skip): ');

    if (sessionCookie.toLowerCase() !== 'skip' && sessionCookie.trim()) {
      // Test 4: Test authenticated access
      console.log('\n4️⃣ Testing authenticated access...');
      
      try {
        const response = await axios.post(`${BASE_URL}/api/games`, {}, {
          headers: {
            'Cookie': `connect.sid=${sessionCookie}`
          }
        });
        
        console.log('✅ Authentication successful!');
        console.log('🎮 Game created:', response.data);
        
        if (response.data.data) {
          console.log(`📋 Game ID: ${response.data.data.gameId}`);
          console.log(`🔑 Room Code: ${response.data.data.roomCode}`);
        }
        
      } catch (error) {
        if (error.response) {
          console.log('❌ Authentication failed:');
          console.log('   Status:', error.response.status);
          console.log('   Message:', error.response.data.message || error.response.data);
          
          if (error.response.status === 401) {
            console.log('💡 Tip: Make sure you copied the cookie correctly and it hasn\'t expired');
          }
        } else {
          console.log('❌ Request failed:', error.message);
        }
      }
    } else {
      console.log('⏭️  Skipping authenticated test');
    }

    // Test 5: Test auth status endpoint
    console.log('\n5️⃣ Testing auth status endpoint...');
    try {
      const userResponse = await axios.get(`${BASE_URL}/user`, {
        headers: sessionCookie && sessionCookie.toLowerCase() !== 'skip' ? {
          'Cookie': `connect.sid=${sessionCookie}`
        } : {}
      });
      console.log('✅ User info retrieved:', userResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('⚠️  Not authenticated - this is expected if no cookie provided');
      } else {
        console.log('❓ Unexpected error getting user info:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }

  console.log('\n🏁 Test complete');
  rl.close();
}

// Additional helper function to test just with a provided cookie
async function quickTest(sessionCookie) {
  console.log('🚀 Quick authentication test...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/games`, {}, {
      headers: {
        'Cookie': `connect.sid=${sessionCookie}`
      }
    });
    
    console.log('✅ Success! Game created:', response.data);
    return response.data;
    
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
    return null;
  }
}

// Export for use in other scripts
module.exports = { quickTest };

// Run tests if this script is executed directly
if (require.main === module) {
  testAuth();
}