# 🎄 Christmas House-of-Games Quiz

A festive family quiz night application inspired by the BBC's House of Games, built as a Progressive Web App (PWA) with real-time multiplayer functionality.

![Christmas Quiz](https://img.shields.io/badge/Season-Christmas%202024-red?style=for-the-badge&logo=🎄)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- 🎯 **6 Mini-Game Rounds**: Clue-Five, Rhyme Time, Answer Smash, Ridiculous Charades, Sound Round, Broken Karaoke
- 🎮 **Real-time Multiplayer**: Socket.IO powered game rooms with 6-character room codes
- 🔐 **Google OAuth**: Secure authentication with session management
- 📱 **Responsive Design**: Mobile-first Christmas-themed UI with glassmorphism effects
- 🏆 **Tournament Style**: 5-round tournaments with team scoring
- 🎄 **Christmas Theme**: Festive design inspired by House of Games

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/calvinorr/Xmas2025Quiz.git
   cd Xmas2025Quiz
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and Google OAuth credentials
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## 🎯 Game Rounds

### 1. 🔍 Clue-Five
5 clues reveal an answer, points decrease with each clue

### 2. 🎵 Rhyme Time  
"Stinky Pinky" style two-word rhyming answers

### 3. 🖼️ Answer Smash
Combine two pictures into one answer

### 4. 🎭 Ridiculous Charades
Acting round limited to Christmas props

### 5. 🎧 Sound Round
10-second reversed festive song snippets

### 6. 🎤 Broken Karaoke
Finish the lyric with the last word missing

## 🏗️ Architecture

### Backend
- **Node.js/Express** - Server framework
- **MongoDB/Mongoose** - Database and ODM
- **Passport.js** - Google OAuth authentication
- **Socket.IO** - Real-time communication
- **Express Sessions** - Session management

### Frontend  
- **React 18** - UI framework with modern hooks
- **React Router** - Client-side routing
- **Axios** - API communication
- **Vite 4** - Build tool (Node 18 compatible)
- **CSS Grid/Flexbox** - Responsive layouts

## 📋 Development Status

### ✅ Completed
- [x] Google OAuth authentication
- [x] Game creation and round selection
- [x] Christmas-themed responsive UI
- [x] Backend APIs and database models
- [x] Socket.IO integration framework
- [x] Round configuration system

### 🚧 In Progress
- [ ] Question bank integration
- [ ] Player joining system

### 📅 Planned
- [ ] Game lobby with real-time updates
- [ ] Game flow and scoring
- [ ] Apple OAuth integration
- [ ] AI question generation
- [ ] PWA features

## 🔧 Environment Setup

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/christmas-quiz
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3000
PORT=5001
```

## 📝 API Endpoints

- `POST /api/games` - Create new game
- `GET /api/games/:gameId` - Get game details
- `PUT /api/games/:gameId/rounds` - Update game rounds
- `GET /auth/google` - Google OAuth login
- `GET /user` - Get current user profile

## 🎨 Design System

### Colors
- **Christmas Red**: #C53030
- **Christmas Green**: #38A169  
- **Christmas Gold**: #D69E2E
- **Christmas White**: #FFFEF7
- **Teal Accent**: #38B2AC

### Features
- Glassmorphism effects with backdrop-filter
- Mobile-first responsive design
- CSS custom properties for theming
- Smooth animations and transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎄 Acknowledgments

- Inspired by BBC's House of Games
- Built with modern React and Node.js
- Christmas theme for family fun
- Designed for accessibility and mobile use

---

*Made with ❤️ for Christmas family fun*