import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCms } from '../../cms/CmsContext'

const tabs = [
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/copy', label: 'Copy' },
  { to: '/admin/cards', label: 'Cards' },
  { to: '/admin/projects', label: 'Projects' },
]

export default function AdminLayout() {
  const { isAuthenticated, loading } = useCms()

  if (loading) {
    return (
      <div className="admin-shell">
        <p className="admin-muted">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-brand">
          <strong>Aditona Admin</strong>
          <NavLink to="/" className="admin-site-link">
            ← View site
          </NavLink>
        </div>
        <nav className="admin-tabs" aria-label="Admin">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="btn btn-soft" onClick={logout}>
          Log out
        </button>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
