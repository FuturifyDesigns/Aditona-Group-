import { Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/event-solutions', label: 'Events' },
  { to: '/creative-marketing', label: 'Creative' },
  { to: '/golf-solutions', label: 'Golf' },
  { to: '/procurement', label: 'Procurement' },
  { to: '/our-work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
]

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found-inner">
        <p className="eyebrow">Error 404</p>
        <h1>This page isn’t here.</h1>
        <p className="not-found-lead">
          The link may be outdated, or the page may have moved. Use the options below to
          get back on track.
        </p>
        <div className="btn-row">
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link to="/contact" className="btn btn-soft">
            Contact us
          </Link>
          <Link to="/request-quote" className="btn btn-soft">
            Request a quote
          </Link>
        </div>
        <div className="not-found-links">
          <p className="eyebrow">Quick links</p>
          <ul>
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
