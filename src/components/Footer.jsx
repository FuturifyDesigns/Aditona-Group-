import { Link } from 'react-router-dom'
import { config } from '../lib/config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h4>{config.brand}</h4>
          <p>
            A multi-disciplinary solutions company delivering events, creative &amp;
            marketing, golf experiences, and sourcing &amp; procurement with vision,
            precision, and execution.
          </p>
          <p style={{ marginTop: '0.75rem' }}>{config.tagline}</p>
        </div>

        <div>
          <h4>Divisions</h4>
          <p>
            <Link to="/event-solutions">Event Solutions</Link>
          </p>
          <p>
            <Link to="/creative-marketing">Creative &amp; Marketing</Link>
          </p>
          <p>
            <Link to="/golf-solutions">Golf Solutions</Link>
          </p>
          <p>
            <Link to="/procurement">Sourcing &amp; Procurement</Link>
          </p>
        </div>

        <div>
          <h4>Company</h4>
          <p>
            <Link to="/about">About</Link>
          </p>
          <p>
            <Link to="/our-work">Our Work</Link>
          </p>
          <p>
            <Link to="/insights">Insights</Link>
          </p>
          <p>
            <Link to="/contact">Contact</Link>
          </p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>
            <a href={`mailto:${config.emails.info}`}>{config.emails.info}</a>
          </p>
          <p>
            <a href={`mailto:${config.emails.enquiries}`}>
              {config.emails.enquiries}
            </a>
          </p>
          <p>
            <a href={`mailto:${config.emails.operations}`}>
              {config.emails.operations}
            </a>
          </p>
          <p>
            <Link to="/enquiry">Make an Enquiry</Link>
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {year} {config.brand}. All rights reserved.
        </span>
        <a
          href="https://futurifydesigns.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by Futurify Designs
        </a>
      </div>
    </footer>
  )
}
