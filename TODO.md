
# Xmas 2025 - House of Games - TODO List

## Phase 1: Project Setup & Core Backend

- [ ] **Project Scaffolding**
    - [ ] Initialize a new project (e.g., with `npm`, `yarn`, or `pip`).
    - [ ] Create a basic directory structure (`/frontend`, `/backend`, `/database`).
    - [ ] Set up version control with Git.
- [ ] **Technology Stack Selection**
    - [ ] Decide on frontend framework (e.g., React, Vue, Svelte).
    - [ ] Decide on backend framework (e.g., Node.js/Express, Python/FastAPI).
    - [ ] Decide on database (e.g., PostgreSQL, Firestore).
    - [ ] Decide on real-time engine (e.g., Socket.io, Supabase Realtime).
- [ ] **Database Schema**
    - [ ] Implement the database schema from the PRD.
    - [ ] Write initial migration scripts.
- [ ] **Authentication**
    - [ ] Set up OAuth 2.0 for Google and Apple.
    - [ ] Create user profiles and manage sessions.
- [ ] **Game Lobby Logic**
    - [ ] Implement game creation (`Host a Game`).
    - [ ] Implement joining a game with a room code.
    - [ ] Implement team selection and player avatars.

## Phase 2: Frontend Development & Game Logic

- [ ] **UI/UX Design**
    - [ ] Create basic wireframes for the lobby, game rounds, and scoreboard.
    - [ ] Design a festive theme with CSS (e.g., snowfall, color palette).
- [ ] **Frontend Scaffolding**
    - [ ] Set up the chosen frontend framework.
    - [ ] Implement routing for different views (home, lobby, game, scoreboard).
- [ ] **Lobby Implementation**
    - [ ] Build the "Host a Game" flow.
    - [ ] Build the "Join a Game" flow.
    - [ ] Implement real-time updates in the lobby (e.g., when players join).
- [ ] **Game Round Implementation**
    - [ ] Implement the logic for each of the 5 selected mini-rounds.
    - [ ] Connect the frontend to the backend for question fetching and answer submission.
- [ ] **Real-time Scoreboard**
    - [ ] Build the scoreboard UI.
    - [ ] Implement real-time score updates.

## Phase 3: AI Integration & PWA

- [ ] **AI Question-Master**
    - [ ] Integrate with a large language model (LLM).
    - [ ] Implement the host's ability to generate new questions for any round.
    - [ ] Log AI-generated questions for quality control.
- [ ] **Progressive Web App (PWA)**
    - [ ] Add a service worker to cache assets and questions.
    - [ ] Implement offline support.
    - [ ] Add a web app manifest for "Add to Home Screen" functionality.

## Phase 4: Testing & Deployment

- [ ] **Testing**
    - [ ] Write unit tests for the backend logic.
    - [ ] Write integration tests for the user flows.
    - [ ] Conduct user acceptance testing (UAT) with the family.
- [ ] **Deployment**
    - [ ] Choose a hosting provider (e.g., Vercel, Netlify, Supabase).
    - [ ] Set up a CI/CD pipeline for automated deployments.
    - [ ] Launch the app!
