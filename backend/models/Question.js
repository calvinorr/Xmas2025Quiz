const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // Assuming 'id' is a UUID, Mongoose's default '_id' (ObjectID) is usually sufficient
  // If you specifically need a UUID 'id' field, uncomment the line below:
  // id: { type: String, required: true, unique: true },

  round_type: { type: String, required: true }, // e.g., "Clue-Five", "Rhyme Time"
  
  prompt: { type: String, required: true }, // The main question or instruction
  
  // Array of possible answers. The correct answer(s) would be known by the game logic.
  // For simplicity, we store them as strings. For more complex scenarios (e.g., images for Answer Smash),
  // you might need a more structured format or separate fields.
  answers: [{ type: String, required: true }], 
  
  points: { type: Number, required: true }, // Points awarded for a correct answer
  
  // Optional URL for media (images, audio snippets, etc.)
  media_url: { type: String } 
});

module.exports = mongoose.model('Question', questionSchema);