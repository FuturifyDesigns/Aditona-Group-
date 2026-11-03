import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { config, isAdminEmail } from '../../lib/config'
import { supabase } from '../../lib/supabase'
import { useCms } from '../../cms/CmsContext'

export default function AdminLogin() {
  const { isAuthenticated } = useCms()
  const navigate = useNavigate()
  const [email, setEmail] = useState(config.adminEmail)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin/enquiries" replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const trimmed = email.trim()
      if (!isAdminEmail(trimmed)) {
        throw new Error(`Only ${config.adminEmail} can access admin.`)
      }
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      })
      if (authError) throw authError
      navigate('/admin/enquiries', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <div className="admin-login-brand">
          <p className="eyebrow">Aditona Group</p>
          <h1>Admin sign in</h1>
          <p className="admin-muted">
            Manage website enquiries, text, and cards in one place.
          </p>
        </div>

        <ol className="admin-login-steps">
          <li>Enter your admin email and password</li>
          <li>Review new enquiries first</li>
          <li>Update website text or cards when needed</li>
        </ol>

        <label className="cms-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="cms-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p className="form-msg err" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
