// Increase the maximum number of event listeners to prevent MaxListenersExceededWarning
// This is often necessary in complex applications or when using certain libraries.
process.setMaxListeners(20); // Adjust the number as needed, 20 is a common choice.

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/database');
require('./config/passport'); // Import and configure Passport strategies

// Connect to database
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'a_default_secret_for_dev_only', // Use a strong secret!
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 24 hours in seconds
  }),
  cookie: {
    secure: false, // Set to true if using HTTPS in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  }
}));

// --- Logging for Debugging Authentication ---
// Log session and user after session middleware
app.use((req, res, next) => {
  console.log('--- Middleware Log ---');
  console.log(`Request URL: ${req.url}`);
  console.log(`Session ID: ${req.sessionID}`);
  console.log(`Session Data:`, req.session);
  console.log(`User (before passport):`, req.user);
  console.log('---------------------');
  next();
});
// -------------------------------------------

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// --- Logging for Debugging Authentication (after passport) ---
// Log user after passport middleware
app.use((req, res, next) => {
  console.log('--- After Passport Middleware Log ---');
  console.log(`User (after passport):`, req.user);
  console.log('------------------------------------');
  next();
});
// -------------------------------------------------------------

const server = http.createServer(app);
const io = socketio(server);

// A simple route to test the server
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/failure',
    successRedirect: '/dashboard'
  })
);

// Auth failure route for debugging
app.get('/auth/failure', (req, res) => {
  res.json({
    error: 'Authentication failed',
    message: 'OAuth authentication with Google failed. Check server logs for details.'
  });
});

// A simple route to get the current user's profile (for testing)
app.get('/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({
    authenticated: true,
    user: {
      id: req.user._id,
      displayName: req.user.displayName,
      email: req.user.email,
      avatar_url: req.user.avatar_url
    }
  });
});

// A simple logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// A simple dashboard route (for testing)
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json({
    message: `Welcome ${req.user.displayName}!`,
    user: {
      id: req.user._id,
      displayName: req.user.displayName,
      email: req.user.email
    },
    links: {
      profile: '/user',
      createGame: '/api/games',
      logout: '/logout'
    }
  });
});

// --- Direct Test Route for Authentication ---
// This is a simplified version of the /api/games route to test auth
app.post('/test-auth', (req, res, next) => {
  console.log('--- /test-auth Route ---');
  console.log(`Is Authenticated (req.isAuthenticated()):`, req.isAuthenticated());
  console.log(`User Object (req.user):`, req.user);
  console.log('------------------------');
  
  if (req.isAuthenticated()) {
    return res.status(200).json({ 
      message: 'Authentication successful!',
      user: req.user 
    });
  }
  res.status(401).json({ message: 'Unauthorized. Please log in.' });
});
// --------------------------------------------

// --- Updated Middleware to Log Details ---
const ensureAuthenticated = (req, res, next) => {
  console.log('--- ensureAuthenticated Middleware ---');
  console.log(`Is Authenticated (req.isAuthenticated()):`, req.isAuthenticated());
  console.log(`User Object (req.user):`, req.user);
  console.log('-------------------------------------');
  
  if (req.isAuthenticated()) {
    return next();
  }
  // If not authenticated, return a 401 Unauthorized status
  res.status(401).json({ message: 'Unauthorized. Please log in.' });
};
// ----------------------------------------

// --- Game Routes ---
// Import and configure game routes, passing the `io` instance
const gamesRoutes = require('./routes/games')(io); // Call the function with `io`
app.use('/api/games', gamesRoutes); // Routes handle their own authentication
// -------------------

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
