const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Corrected path: ../models/User
// const AppleStrategy = require('passport-apple').Strategy; // Uncomment when Apple strategy is fully configured

// Serialize user into the session
// We serialize the user's _id (which is an ObjectId) into the session
passport.serializeUser((user, done) => {
  console.log('Serializing user with ID:', user.id);
  done(null, user.id);
});

// Deserialize user from the session
// We deserialize by finding the user by _id in the database
passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user with ID:', id);
    const user = await User.findById(id);
    if (user) {
      console.log('User found during deserialization:', user.displayName);
    } else {
      console.log('User not found during deserialization for ID:', id);
    }
    done(null, user);
  } catch (err) {
    console.error('Error during deserialization:', err);
    done(err, null);
  }
});

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback" // This needs to match the redirect URI configured in your Google Developer Console
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile received:', profile.displayName, profile.emails);

    // Try to find the user in our database by their Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      // User already exists in our database
      console.log('Existing user found in database:', user.displayName);
      return done(null, user);
    } else {
      // User does not exist, so we create a new one
      console.log('Creating new user in database for:', profile.displayName);
      
      // Validate required fields
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
      if (!email) {
        console.error('No email provided by Google for user:', profile.displayName);
        return done(new Error('Email is required'), null);
      }

      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: email,
        avatar_url: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null // Get the profile picture
      });

      const savedUser = await user.save();
      console.log('New user created and saved:', savedUser.displayName);
      return done(null, savedUser);
    }
  } catch (err) {
    console.error('Error in Google Strategy:', err);
    return done(err, null);
  }
}));

// TODO: Configure Apple OAuth Strategy
// This requires setting up a service ID, key ID, and private key from Apple.
// The passport-apple strategy has specific requirements for these.
/*
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID, // Service ID
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    key: process.env.APPLE_PRIVATE_KEY, // The contents of the .p8 key file
    callbackURL: "/auth/apple/callback",
    scope: ['email', 'name']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Similar logic to Google strategy for finding/creating user in the database
      console.log('Apple profile received:', profile);
      // ... (implementation details for Apple)
      // const user = await User.findOrCreate(...); 
      // return done(null, user);
    } catch (err) {
      console.error('Error in Apple Strategy:', err);
      return done(err, null);
    }
  }
));
*/

module.exports = passport;