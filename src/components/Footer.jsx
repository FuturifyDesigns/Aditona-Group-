import { Link } from 'react-router-dom'
import EditableText from '../cms/EditableText'
import { config } from '../lib/config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <EditableText contentKey="footer.brand" as="h4">
            {config.brand}
          </EditableText>
          <EditableText contentKey="footer.blurb" as="p" multiline>
            A multi-disciplinary solutions company delivering events, creative &amp;
            marketing, golf experiences, and sourcing &amp; procurement with vision,
            precision, and execution.
          </EditableText>
          <EditableText
            contentKey="footer.tagline"
            as="p"
            style={{ marginTop: '0.75rem' }}
          >
            {config.tagline}
          </EditableText>
        </div>

        <div>
          <EditableText contentKey="footer.divisions_heading" as="h4">
            Divisions
          </EditableText>
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
          <EditableText contentKey="footer.company_heading" as="h4">
            Company
          </EditableText>
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
          <EditableText contentKey="footer.contact_heading" as="h4">
            Contact
          </EditableText>
          {config.emailChannels.map((channel) => (
            <p key={channel.email} className="footer-email">
              <a href={`mailto:${channel.email}`}>{channel.email}</a>
              <span>{channel.hint}</span>
            </p>
          ))}
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
