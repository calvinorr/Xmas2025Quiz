const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Use Google's unique ID as the primary identifier
  googleId: { type: String, required: true, unique: true },
  
  displayName: { type: String, required: true },
  
  // Store the primary email provided by Google
  email: { type: String, required: true },
  
  // URL to the user's Google profile picture
  avatar_url: { type: String },
  
  // Timestamps for when the user was created and last updated
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);