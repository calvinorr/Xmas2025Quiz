import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:5001'

// Define available mini-rounds from PRD
const AVAILABLE_ROUNDS = [
  {
    id: 'clue-five',
    name: 'Clue-Five',
    description: '5 clues, points decrease with each revealed clue',
    emoji: '🔍'
  },
  {
    id: 'rhyme-time',
    name: 'Rhyme Time',
    description: '"Stinky Pinky" style two-word rhymes',
    emoji: '🎵'
  },
  {
    id: 'answer-smash',
    name: 'Answer Smash',
    description: 'Combine two pictures into one answer',
    emoji: '🖼️'
  },
  {
    id: 'ridiculous-charades',
    name: 'Ridiculous Charades',
    description: 'Acting round limited to Christmas props',
    emoji: '🎭'
  },
  {
    id: 'sound-round',
    name: 'Sound Round',
    description: '10-second reversed festive song snippets',
    emoji: '🎧'
  },
  {
    id: 'broken-karaoke',
    name: 'Broken Karaoke',
    description: 'Finish the lyric with the last word missing',
    emoji: '🎤'
  }
]

function GameSetup() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRounds, setSelectedRounds] = useState([])
  const [isConfiguring, setIsConfiguring] = useState(false)

  useEffect(() => {
    fetchGameDetails()
  }, [gameId])

  const fetchGameDetails = async () => {
    try {
      setLoading(true)
      // We'll need to create this API endpoint
      const response = await axios.get(`${API_BASE}/api/games/${gameId}`)
      setGame(response.data.data)
      
      // If rounds are already configured, load them
      if (response.data.data.rounds && response.data.data.rounds.length > 0) {
        setSelectedRounds(response.data.data.rounds.map(round => round.id))
      }
      
      setError(null)
    } catch (err) {
      setError('Failed to load game details')
      console.error('Error fetching game:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleRound = (roundId) => {
    setSelectedRounds(prev => {
      if (prev.includes(roundId)) {
        return prev.filter(id => id !== roundId)
      } else if (prev.length < 5) {
        return [...prev, roundId]
      } else {
        // Replace the first selected round if already at limit
        return [...prev.slice(1), roundId]
      }
    })
  }

  const saveGameConfiguration = async () => {
    if (selectedRounds.length !== 5) {
      setError('Please select exactly 5 rounds')
      return
    }

    try {
      setIsConfiguring(true)
      setError(null)

      // Map selected round IDs to full round objects
      const roundsConfig = selectedRounds.map((roundId, index) => {
        const roundData = AVAILABLE_ROUNDS.find(r => r.id === roundId)
        return {
          id: roundId,
          name: roundData.name,
          description: roundData.description,
          order: index + 1,
          questions: [] // Will be populated later
        }
      })

      // Save to backend
      await axios.put(`${API_BASE}/api/games/${gameId}/rounds`, {
        rounds: roundsConfig
      })

      // TODO: Navigate to question selection or game lobby
      alert('Game configuration saved! Ready for players to join.')
      
    } catch (err) {
      setError('Failed to save game configuration')
      console.error('Error saving config:', err)
    } finally {
      setIsConfiguring(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading game details...</div>
  }

  if (!game) {
    return <div className="error">Game not found</div>
  }

  return (
    <div className="game-setup">
      <div className="game-header">
        <h1>🎮 Game Setup</h1>
        <div className="game-info">
          <h2>Room Code: <span className="room-code">{game.roomCode}</span></h2>
          <p>Game ID: {game._id}</p>
        </div>
      </div>

      <div className="setup-section">
        <h3>Choose 5 Mini-Rounds</h3>
        <p className="instruction">
          Select exactly 5 rounds for your Christmas quiz tournament. 
          Currently selected: <strong>{selectedRounds.length}/5</strong>
        </p>

        <div className="rounds-grid">
          {AVAILABLE_ROUNDS.map((round) => (
            <div
              key={round.id}
              className={`round-card ${selectedRounds.includes(round.id) ? 'selected' : ''}`}
              onClick={() => toggleRound(round.id)}
            >
              <div className="round-emoji">{round.emoji}</div>
              <h4>{round.name}</h4>
              <p>{round.description}</p>
              {selectedRounds.includes(round.id) && (
                <div className="round-order">
                  Round {selectedRounds.indexOf(round.id) + 1}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedRounds.length === 5 && (
          <div className="selected-rounds-summary">
            <h4>Selected Rounds (in order):</h4>
            <ol>
              {selectedRounds.map((roundId) => {
                const round = AVAILABLE_ROUNDS.find(r => r.id === roundId)
                return <li key={roundId}>{round.emoji} {round.name}</li>
              })}
            </ol>
          </div>
        )}

        <div className="setup-actions">
          <button 
            className="back-btn" 
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
          
          <button
            className="save-config-btn"
            onClick={saveGameConfiguration}
            disabled={selectedRounds.length !== 5 || isConfiguring}
          >
            {isConfiguring ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

        {error && (
          <div className="error">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default GameSetup