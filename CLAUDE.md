# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Christmas House-of-Games is a family quiz night application built as a Progressive Web App (PWA). It provides a House-of-Games-style quiz tournament with real-time multiplayer functionality, OAuth authentication, and AI-powered question generation.

## Architecture

**Backend Structure:**
- **Node.js/Express** server with Socket.IO for real-time communication
- **MongoDB/Mongoose** for data persistence
- **Passport.js** for OAuth authentication (Google OAuth implemented, Apple planned)
- **MVC pattern** with separate models, controllers, and routes

**Frontend Structure:**
- **React 18** with modern hooks (useState, useEffect)
- **React Router** for navigation between pages
- **Axios** for API communication with backend
- **Vite 4** for development and building (Node 18 compatible)
- **Christmas-themed design system** inspired by House of Games

**Key Components:**
- `backend/index.js` - Main server entry point with Express app, Socket.IO, and authentication middleware
- `backend/config/` - Database connection and Passport strategy configuration  
- `backend/models/` - Mongoose schemas for Game, User, Player, Team, Question, Answer
- `backend/controllers/` - Business logic with Socket.IO integration via factory pattern
- `backend/routes/` - Express routes with authentication middleware
- `frontend/src/App.jsx` - Main React Router setup
- `frontend/src/components/HomePage.jsx` - Authentication and game creation
- `frontend/src/components/GameSetup.jsx` - Round selection interface
- `frontend/src/App.css` - Complete Christmas-themed design system

**Authentication Flow:**
- Google OAuth 2.0 with Passport.js session management
- Session-based authentication with connect.sid cookies
- Protected routes use `ensureAuthenticated` middleware

## Development Commands

**Backend Development:**
```bash
cd backend
npm install                    # Install dependencies
npm start                     # Start production server (port 5001)
node index.js                 # Direct start
node test-host-game.js        # Test authenticated API endpoint
```

**Frontend Development:**
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Start development server (port 3000)
npm run build                  # Build for production
```

**Environment Setup:**
- Copy `.env.example` to `.env` and configure:
  - `MONGO_URI` - MongoDB connection string
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
  - `SESSION_SECRET` - Session encryption key

**Testing Authenticated Endpoints:**
1. Start backend server: `npm start`
2. Visit `/auth/google` to authenticate
3. Extract session cookie from browser dev tools
4. Update `SESSION_COOKIE` in `test-host-game.js`
5. Run: `node test-host-game.js`

## Data Model

The application uses a nested document structure with references:

- **Game** - Contains roomCode, host_id, rounds array, teams array
- **Team** - Referenced in Game.teams, contains players and score
- **Player/User** - OAuth user profiles with Google integration
- **Question** - Round-specific questions with media support
- **Answer** - Player responses with scoring and timestamps

Game rooms use 6-character alphanumeric codes for player joining.

## Current Implementation Status

**✅ Completed (December 2024):**
- OAuth authentication with Google
- Database schema and models
- Game creation API endpoint (`POST /api/games`)
- Game retrieval API endpoint (`GET /api/games/:gameId`)
- Round configuration API endpoint (`PUT /api/games/:gameId/rounds`)
- Room code generation and uniqueness validation
- Socket.IO integration framework
- Authentication middleware and session management
- Complete React frontend with routing
- Game setup page with round selection interface
- Christmas-themed responsive design system
- Mobile-first responsive layouts
- Round configuration and saving functionality (tested and working)

**🚧 In Progress:**
- Question bank integration for round configuration
- Player joining system with room code entry

**📋 Planned:**
- Game lobby with Socket.IO real-time updates
- Basic game flow and state management
- Apple OAuth integration
- AI question generation
- PWA features and offline support
- 6 mini-game rounds implementation

## Socket.IO Integration

Controllers use a factory pattern to receive the Socket.IO instance:
```javascript
const gamesController = getGamesController(io);
```

This allows real-time communication for game state updates, player joins, and score changes.

## Error Handling Patterns

- Mongoose validation errors return 400 status
- Authentication failures return 401 status  
- Duplicate room codes trigger retry logic with max attempts
- Extensive logging for debugging authentication flow

## Recent Development Progress

**Round Selection System (Completed):**
- 6 available mini-rounds: Clue-Five, Rhyme Time, Answer Smash, Ridiculous Charades, Sound Round, Broken Karaoke
- Interactive card-based selection interface
- Exactly 5 rounds must be selected for tournament
- Real-time validation and visual feedback
- Round ordering system (shows Round 1, Round 2, etc.)
- Christmas-themed responsive design with glassmorphism effects

**Design System:**
- Christmas color palette: Red (#C53030), Green (#38A169), Gold (#D69E2E)
- House of Games inspired styling with modern glassmorphism
- Mobile-first responsive design with clamp() typography
- CSS Grid layouts for round selection
- Hover effects and smooth transitions

**API Integration:**
- Complete authentication flow with Google OAuth
- Game creation and configuration APIs working
- Socket.IO real-time updates for game state changes
- Error handling and validation throughout

## Next Steps

1. **Question Bank Integration** - Add question management for each round type
2. **Player Joining System** - Room code entry and player management
3. **Game Lobby** - Real-time player list with Socket.IO
4. **Game Flow** - Implement actual game rounds and scoring

## Security Considerations

- Session secrets should be environment variables in production
- HTTPS required for secure cookies in production
- OAuth redirect URIs must match Google Developer Console configuration
- Database connection uses environment variable for MongoDB URI