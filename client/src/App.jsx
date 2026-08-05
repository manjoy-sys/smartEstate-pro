import React, { useState } from 'react'

const API = 'http://localhost:4000'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [access, setAccess] = useState(null)
  const [message, setMessage] = useState('')

  async function register() {
    const r = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const j = await r.json()
    setMessage(JSON.stringify(j))
  }

  async function login() {
    const r = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }), credentials: 'include' })
    const j = await r.json()
    if (j.accessToken) setAccess(j.accessToken)
    setMessage(JSON.stringify(j))
  }

  async function me() {
    if (!access) return setMessage('no access token')
    const r = await fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${access}` } })
    const j = await r.json()
    setMessage(JSON.stringify(j))
  }

  return (
    <div style={{ maxWidth: 600, margin: 40 }}>
      <h1>SmartEstate Pro (MVP)</h1>
      <div>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
        <button onClick={me}>Who am I</button>
      </div>
      <pre style={{ background: '#f5f5f5', padding: 12, marginTop: 12 }}>{message}</pre>
    </div>
  )
}

export default App
