import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: '50vh' }}>
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <div className="btn-row" style={{ marginTop: '1.25rem' }}>
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link to="/contact" className="btn btn-soft">
            Contact
          </Link>
        </div>
      </div>
    </section>
  )
}
