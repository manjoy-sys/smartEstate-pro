import React, { useState, useEffect } from 'react'

// Get API URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accessToken, setAccessToken] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  // Check if API is reachable on component mount
  useEffect(() => {
    console.log('API URL:', API_URL)
    setMessage(`Connected to API at: ${API_URL}`)
  }, [])

  const showMessage = (msg, type = 'info') => {
    setMessage(JSON.stringify(msg, null, 2))
    console.log(`[${type}]`, msg)
  }

  const handleError = (error, context = '') => {
    const errorMsg = error?.message || error || 'Unknown error'
    showMessage({ error: errorMsg, context }, 'error')
  }

  async function register() {
    if (!email || !password) {
      return showMessage({ error: 'Email and password are required' }, 'warning')
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return showMessage(data, 'error')
      }

      showMessage(data, 'success')
      setEmail('')
      setPassword('')
    } catch (error) {
      handleError(error, 'Register request failed')
    } finally {
      setLoading(false)
    }
  }

  async function login() {
    if (!email || !password) {
      return showMessage({ error: 'Email and password are required' }, 'warning')
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      })

      const data = await response.json()

      if (!response.ok) {
        return showMessage(data, 'error')
      }

      if (data.accessToken) {
        setAccessToken(data.accessToken)
        showMessage({ success: 'Logged in successfully', token: data.accessToken }, 'success')
      } else {
        showMessage(data, 'info')
      }
    } catch (error) {
      handleError(error, 'Login request failed')
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserInfo() {
    if (!accessToken) {
      return showMessage({ error: 'No access token. Please login first.' }, 'warning')
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      const data = await response.json()

      if (!response.ok) {
        return showMessage(data, 'error')
      }

      setUser(data)
      showMessage(data, 'success')
    } catch (error) {
      handleError(error, 'Failed to fetch user info')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setAccessToken(null)
    setUser(null)
    setEmail('')
    setPassword('')
    setMessage('Logged out successfully')
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🏠 SmartEstate Pro (MVP)</h1>
        <p style={styles.subtitle}>Full-Stack Real Estate Platform</p>
      </header>

      <main style={styles.main}>
        {/* Status Display */}
        <div style={styles.statusBox}>
          <strong>Status:</strong>
          <span style={styles.statusText}>
            {accessToken ? '✅ Logged In' : '❌ Not Logged In'}
          </span>
          {user && (
            <div style={styles.userInfo}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Verified:</strong> {user.verified ? '✅' : '❌'}</p>
            </div>
          )}
        </div>

        {/* Input Fields */}
        <div style={styles.formGroup}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || !!accessToken}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || !!accessToken}
            style={styles.input}
          />
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          {!accessToken ? (
            <>
              <button
                onClick={register}
                disabled={loading}
                style={{ ...styles.button, backgroundColor: '#4CAF50' }}
              >
                {loading ? '⏳ Loading...' : '📝 Register'}
              </button>
              <button
                onClick={login}
                disabled={loading}
                style={{ ...styles.button, backgroundColor: '#2196F3' }}
              >
                {loading ? '⏳ Loading...' : '🔓 Login'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={fetchUserInfo}
                disabled={loading}
                style={{ ...styles.button, backgroundColor: '#FF9800' }}
              >
                {loading ? '⏳ Loading...' : '👤 Who am I?'}
              </button>
              <button
                onClick={logout}
                style={{ ...styles.button, backgroundColor: '#f44336' }}
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>

        {/* Message Display */}
        <div style={styles.messageBox}>
          <strong>Response:</strong>
          <pre style={styles.messageContent}>{message}</pre>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>API: {API_URL}</p>
        <p>Need help? Check the GitHub repository documentation</p>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #ddd',
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    marginTop: '5px',
  },
  main: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  statusBox: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid #ddd',
  },
  statusText: {
    marginLeft: '10px',
    fontWeight: 'bold',
    color: '#2196F3',
  },
  userInfo: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#555',
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    minWidth: '120px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  messageBox: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  messageContent: {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #eee',
    overflow: 'auto',
    maxHeight: '300px',
    fontSize: '12px',
    marginTop: '10px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    color: '#999',
    fontSize: '12px',
  },
}

export default App
