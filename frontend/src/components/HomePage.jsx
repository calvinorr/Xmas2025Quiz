import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:5001'

function HomePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/user`)
      setUser(response.data.user)
      setError(null)
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null)
      } else {
        setError('Failed to check authentication status')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE}/logout`)
      setUser(null)
    } catch (err) {
      setError('Failed to logout')
    }
  }

  const createGame = async () => {
    try {
      setError(null)
      const response = await axios.post(`${API_BASE}/api/games`)
      // Navigate to game setup page
      navigate(`/game/${response.data.data.gameId}/setup`)
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Not authenticated - please login first')
      } else {
        setError('Failed to create game: ' + (err.response?.data?.message || err.message))
      }
    }
  }

  if (loading) {
    return <div className="loading">Checking authentication...</div>
  }

  return (
    <>
      <h1>🎄 Christmas House-of-Games</h1>
      <div className="auth-section">
        {user ? (
          <div className="user-info">
            <h2>Welcome, {user.displayName}!</h2>
            <p>Email: {user.email}</p>
            {user.avatar_url && (
              <img src={user.avatar_url} alt="Profile" className="avatar" />
            )}
            <div className="actions">
              <button onClick={createGame} className="create-game-btn">
                Host New Game
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="login-section">
            <h2>Please login to continue</h2>
            <button onClick={handleLogin} className="login-btn">
              Login with Google
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}
    </>
  )
}

export default HomePage