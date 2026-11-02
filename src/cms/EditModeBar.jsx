import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCms } from './CmsContext'

export default function EditModeBar() {
  const { isAuthenticated, editMode, setEditMode, user } = useCms()

  if (!isAuthenticated) return null

  const logout = async () => {
    setEditMode(false)
    await supabase.auth.signOut()
  }

  return (
    <div className="cms-bar" role="region" aria-label="CMS toolbar">
      <span className="cms-bar-label">
        Signed in as {user?.email || 'admin'}
      </span>
      <button
        type="button"
        className={`cms-bar-toggle${editMode ? ' is-on' : ''}`}
        onClick={() => setEditMode((v) => !v)}
      >
        {editMode ? 'Edit Live: ON' : 'Edit Live: OFF'}
      </button>
      <Link to="/admin" className="cms-bar-link">
        Admin
      </Link>
      <button type="button" className="cms-bar-link" onClick={logout}>
        Log out
      </button>
    </div>
  )
}
