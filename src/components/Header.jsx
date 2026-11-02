import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import EditableButton from '../cms/EditableButton'
import { config } from '../lib/config'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/event-solutions', label: 'Events' },
  { to: '/creative-marketing', label: 'Creative' },
  { to: '/golf-solutions', label: 'Golf' },
  { to: '/our-work', label: 'Work' },
  { to: '/insights', label: 'Insights' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const closeMenu = () => setOpen(false)

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="brand" onClick={closeMenu} aria-label={config.brand}>
          <img src={logoSrc} alt="Aditona Group" className="brand-logo" />
        </Link>

        <nav className="nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <EditableButton
          to="/request-quote"
          contentKey="nav.cta"
          className="btn btn-primary header-cta"
        >
          Request a Quote
        </EditableButton>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className={`mobile-nav${open ? ' open' : ''}`} aria-label="Mobile">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
        <EditableButton
          to="/request-quote"
          contentKey="nav.cta"
          className="btn btn-primary"
          onClick={closeMenu}
        >
          Request a Quote
        </EditableButton>
      </nav>
    </header>
  )
}
