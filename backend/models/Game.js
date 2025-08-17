const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  // Assuming 'id' is a UUID, Mongoose's default '_id' (ObjectID) is usually sufficient
  // If you specifically need a UUID 'id' field, uncomment the line below:
  // id: { type: String, required: true, unique: true },

  // Unique room code for players to join the game
  roomCode: { type: String, required: true, unique: true, index: true }, // Add index for quick lookups

  // Reference to the Player who is the host
  host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  
  // Array of round configurations
  // Using Mixed type to allow flexibility for different round structures
  // As per PRD: rounds: jsonb[]
  rounds: { type: mongoose.Schema.Types.Mixed, default: [] }, 
  
  // Array of Team references
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  
  // Timestamp of when the game was created
  created_at: { type: Date, default: Date.now }
  
  // TODO: Add fields for current round, game state (waiting, in-progress, finished), winner, etc.
  // For example:
  // current_round_index: { type: Number, default: 0 },
  // status: { type: String, enum: ['waiting', 'in-progress', 'finished'], default: 'waiting' },
  // winner_team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' } // Optional
});

// Index for efficient querying by host
gameSchema.index({ host_id: 1 });

module.exports = mongoose.model('Game', gameSchema);