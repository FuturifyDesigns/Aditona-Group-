import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCms } from '../../cms/CmsContext'

const tabs = [
  {
    to: '/admin/enquiries',
    label: 'Enquiries',
    hint: 'Messages from the website',
  },
]

export default function AdminLayout() {
  const { isAuthenticated, loading, setEditMode } = useCms()
  const location = useLocation()

  if (loading) {
    return (
      <div className="admin-shell">
        <div className="admin-loading">
          <p>Loading admin…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const active = tabs.find((t) => location.pathname.startsWith(t.to))

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <strong>Aditona Admin</strong>
          <span>Enquiries + live site editing</span>
        </div>
        <nav className="admin-nav" aria-label="Admin">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
            >
              <span className="admin-nav-label">{tab.label}</span>
              <span className="admin-nav-hint">{tab.hint}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <NavLink
            to="/?edit=1"
            className="admin-live-edit-btn"
            onClick={() => setEditMode(true)}
          >
            Edit live site
          </NavLink>
          <p className="admin-live-edit-hint">
            Turn on live edit to change text, cards, images, footer, and projects on
            the website itself.
          </p>
          <button type="button" className="btn btn-soft admin-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Admin portal</p>
            <h1>{active?.label || 'Dashboard'}</h1>
            <p className="admin-muted">{active?.hint}</p>
          </div>
          <NavLink
            to="/?edit=1"
            className="btn btn-primary admin-top-live"
            onClick={() => setEditMode(true)}
          >
            Edit live site
          </NavLink>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
