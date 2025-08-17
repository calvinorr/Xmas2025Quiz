// test-host-game.js
// A simple script to test the "Host a Game" API endpoint.
// This script simulates an authenticated request by using a session cookie.

const axios = require('axios');

// --- Configuration ---
// 1. Make sure your backend server is running on http://localhost:5001
// 2. YOU MUST UPDATE THIS COOKIE VALUE with the one from your browser after logging in.
//    See the instructions in the comments above this script.
const SESSION_COOKIE = 's%3AWbi_xtL_BOxf7xF9-qlylahA7bJtUaSe.rjxUv7uAeVXAg7zOo1YkGbYos5UaYREMVNTSpSwie8o'; // e.g., 's%3Aabc123def456...';

const API_URL = 'http://localhost:5001/api/games';
// --------------------

// Configure axios default headers to include the session cookie
// This makes it act like an authenticated browser session
axios.defaults.headers.common['Cookie'] = `connect.sid=${SESSION_COOKIE}`;

async function testHostGame() {
  console.log('Attempting to create a new game...');

  try {
    // Make a POST request to the /api/games endpoint
    const response = await axios.post(API_URL);

    // If successful, log the response data
    console.log('Success! Game created.');
    console.log('Response Data:', response.data);

    // The response should include the gameId and roomCode
    // You can use these values for further testing (e.g., joining the game)
    const { gameId, roomCode } = response.data.data;
    console.log(`\nGame ID: ${gameId}`);
    console.log(`Room Code: ${roomCode}`);

    // TODO: You could add more logic here to automatically test joining the game
    // or save the room code to a file for use by another script.

  } catch (error) {
    // If there's an error, log it
    console.error('Error creating game:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the test function
testHostGame();