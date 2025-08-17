const Game = require('../models/Game');
// const Player = require('../models/Player'); // We might need this later

/**
 * Factory function for games controller.
 * Accepts the Socket.IO instance to be used by controller methods.
 * @param {Object} io - The Socket.IO server instance.
 * @returns {Object} - An object containing controller methods.
 */
module.exports = (io) => {
    /**
     * Generates a random room code.
     * @param {number} length - The length of the room code.
     * @returns {string} A random alphanumeric string.
     */
    const generateRoomCode = (length = 6) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    /**
     * @desc    Create a new game
     * @route   POST /api/games
     * @access  Private (requires authentication)
     */
    const createGame = async (req, res) => {
        try {
            const hostId = req.user._id; // Using MongoDB ObjectId from Passport user
            // `io` is now available directly from the closure

            // TODO: Validate hostId exists in Player collection if necessary

            // Generate a unique room code
            let roomCode;
            let isUnique = false;
            let attempts = 0;
            const maxAttempts = 10; // Prevent infinite loop

            while (!isUnique && attempts < maxAttempts) {
                roomCode = generateRoomCode();
                // Check if a game with this room code already exists
                const existingGame = await Game.findOne({ roomCode: roomCode });
                if (!existingGame) {
                    isUnique = true;
                }
                attempts++;
            }

            if (!isUnique) {
                return res.status(500).json({ message: 'Failed to generate unique room code. Please try again.' });
            }

            // Create a new game instance
            const newGame = new Game({
                roomCode: roomCode,
                host_id: hostId,
                rounds: [], // Start with an empty array of rounds
                teams: []   // Start with an empty array of teams
            });

            // Save the game to the database
            const savedGame = await newGame.save();

            // Set up Socket.IO room for real-time communication for this game
            // In a more complex setup, you might initialize room-specific data here
            // or set up listeners for events specific to this game room.
            // For now, we just acknowledge the room is created.
            if (io) {
                // Join the host to the game room
                // Note: In a real scenario, the host would join via Socket.IO on the frontend after receiving the room code.
                // This is just a placeholder to show how you might interact with io.
                console.log(`Game room ${roomCode} created for game ID ${savedGame._id}`);
            }

            // Respond with the created game details
            res.status(201).json({
                success: true,
                data: {
                    gameId: savedGame._id,
                    roomCode: savedGame.roomCode // Send the actual room code
                }
            });

        } catch (err) {
            console.error('Error creating game:', err.message);
            // Check for specific Mongoose errors (e.g., validation)
            if (err.name === 'ValidationError' || err.code === 11000) { // 11000 is duplicate key error
                return res.status(400).json({ message: 'Invalid data provided or room code conflict.', error: err.message });
            }
            res.status(500).json({ message: 'Server error while creating game.' });
        }
    };

    /**
     * @desc    Get game details by ID
     * @route   GET /api/games/:gameId
     * @access  Private (requires authentication)
     */
    const getGame = async (req, res) => {
        try {
            const { gameId } = req.params;
            const userId = req.user._id;

            console.log(`--- getGame Controller ---`);
            console.log(`Requested Game ID: ${gameId}`);
            console.log(`Requesting User ID: ${userId}`);

            // Find the game and verify the user is the host
            const game = await Game.findById(gameId);
            
            console.log(`Game found:`, game ? `Yes (Room: ${game.roomCode})` : 'No');
            
            if (!game) {
                console.log(`Game not found for ID: ${gameId}`);
                return res.status(404).json({ message: 'Game not found' });
            }

            // Check if the requesting user is the host
            console.log(`Game host ID: ${game.host_id}`);
            console.log(`User ID: ${userId}`);
            console.log(`Host match:`, game.host_id.toString() === userId.toString());
            
            if (game.host_id.toString() !== userId.toString()) {
                console.log(`Access denied - user is not the host`);
                return res.status(403).json({ message: 'Access denied. Only the game host can view game details.' });
            }

            console.log(`Successfully returning game data`);
            res.status(200).json({
                success: true,
                data: game
            });

        } catch (err) {
            console.error('Error fetching game:', err.message);
            console.error('Full error:', err);
            res.status(500).json({ message: 'Server error while fetching game details.' });
        }
    };

    /**
     * @desc    Update game rounds configuration
     * @route   PUT /api/games/:gameId/rounds
     * @access  Private (requires authentication and host permission)
     */
    const updateGameRounds = async (req, res) => {
        try {
            const { gameId } = req.params;
            const { rounds } = req.body;
            const userId = req.user._id;

            // Validate rounds data
            if (!rounds || !Array.isArray(rounds) || rounds.length !== 5) {
                return res.status(400).json({ message: 'Invalid rounds data. Must provide exactly 5 rounds.' });
            }

            // Find the game and verify the user is the host
            const game = await Game.findById(gameId);
            
            if (!game) {
                return res.status(404).json({ message: 'Game not found' });
            }

            // Check if the requesting user is the host
            if (game.host_id.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'Access denied. Only the game host can configure rounds.' });
            }

            // Update the game with the new rounds configuration
            game.rounds = rounds;
            const updatedGame = await game.save();

            // Emit socket event to notify any connected clients about the game update
            if (io) {
                io.to(game.roomCode).emit('gameConfigUpdated', {
                    gameId: game._id,
                    rounds: rounds
                });
                console.log(`Game ${game.roomCode} rounds updated:`, rounds.map(r => r.name).join(', '));
            }

            res.status(200).json({
                success: true,
                message: 'Game rounds configuration updated successfully',
                data: {
                    gameId: updatedGame._id,
                    roomCode: updatedGame.roomCode,
                    rounds: updatedGame.rounds
                }
            });

        } catch (err) {
            console.error('Error updating game rounds:', err.message);
            if (err.name === 'ValidationError') {
                return res.status(400).json({ message: 'Invalid data provided.', error: err.message });
            }
            res.status(500).json({ message: 'Server error while updating game configuration.' });
        }
    };

    // Return the controller methods
    return {
        createGame,
        getGame,
        updateGameRounds
    };
};