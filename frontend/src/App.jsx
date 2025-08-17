import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import HomePage from './components/HomePage'
import GameSetup from './components/GameSetup'
import './App.css'

// Configure axios to send credentials (cookies) with requests
axios.defaults.withCredentials = true

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:gameId/setup" element={<GameSetup />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
