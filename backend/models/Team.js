const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  // Assuming 'id' is a UUID, Mongoose's default '_id' (ObjectID) is usually sufficient
  // If you specifically need a UUID 'id' field, uncomment the line below:
  // id: { type: String, required: true, unique: true },

  name: { type: String, required: true },
  
  // Array of Player references
  players: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Player' 
    // Consider adding validation to ensure a team has a reasonable number of players
  }],

  score: { type: Number, default: 0 }
  // Add other team-specific fields if needed (e.g., team color, motto)
});

module.exports = mongoose.model('Team', teamSchema);