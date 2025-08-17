const express = require('express');
const router = express.Router();

// Import the controller factory function
const getGamesController = require('../controllers/gamesController');

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // If not authenticated, return a 401 Unauthorized status
  res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

// This function will be called from index.js with the `io` instance
// It sets up the routes with the correct controller that has access to `io`
module.exports = (io) => {
  // Create the controller instance with the `io` object
  const gamesController = getGamesController(io);

  // Route to create a new game (Host a Game)
  // POST /api/games
  router.post('/', ensureAuthenticated, gamesController.createGame);

  // Route to get game details by ID
  // GET /api/games/:gameId
  router.get('/:gameId', (req, res, next) => {
    console.log(`--- Route Handler GET /api/games/:gameId ---`);
    console.log(`Game ID: ${req.params.gameId}`);
    console.log(`User authenticated: ${req.isAuthenticated()}`);
    next();
  }, ensureAuthenticated, gamesController.getGame);

  // Route to update game rounds configuration
  // PUT /api/games/:gameId/rounds
  router.put('/:gameId/rounds', ensureAuthenticated, gamesController.updateGameRounds);

  // TODO: Add more routes for joining a game, getting game state, etc.

  return router;
};