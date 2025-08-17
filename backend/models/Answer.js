const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  // Assuming 'id' is a UUID, Mongoose's default '_id' (ObjectID) is usually sufficient
  // If you specifically need a UUID 'id' field, uncomment the line below:
  // id: { type: String, required: true, unique: true },

  // Reference to the Player who submitted the answer
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  
  // Reference to the Question being answered
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  
  // The actual text of the player's answer
  text: { type: String, required: true },
  
  // Timestamp of when the answer was submitted
  timestamp: { type: Date, default: Date.now },
  
  // Score awarded for this specific answer
  score: { type: Number, default: 0 }
});

// Indexes for efficient querying
// For example, finding all answers for a specific question or player
answerSchema.index({ question_id: 1 });
answerSchema.index({ player_id: 1 });

module.exports = mongoose.model('Answer', answerSchema);