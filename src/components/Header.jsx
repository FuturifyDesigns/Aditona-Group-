import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import EditableButton from '../cms/EditableButton'
import EditableText from '../cms/EditableText'
import { config } from '../lib/config'

const links = [
  { to: '/', label: 'Home', end: true, key: 'nav.home' },
  { to: '/about', label: 'About', key: 'nav.about' },
  { to: '/event-solutions', label: 'Events', key: 'nav.events' },
  { to: '/creative-marketing', label: 'Creative', key: 'nav.creative' },
  { to: '/golf-solutions', label: 'Golf', key: 'nav.golf' },
  { to: '/procurement', label: 'Procurement', key: 'nav.procurement' },
  { to: '/our-work', label: 'Work', key: 'nav.work' },
  { to: '/insights', label: 'Insights', key: 'nav.insights' },
  { to: '/contact', label: 'Contact', key: 'nav.contact' },
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
              <EditableText contentKey={link.key} as="span">
                {link.label}
              </EditableText>
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
          className={`menu-toggle${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-toggle-box" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
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
            <EditableText contentKey={link.key} as="span">
              {link.label}
            </EditableText>
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
