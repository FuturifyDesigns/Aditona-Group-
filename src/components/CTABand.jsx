import { Link } from 'react-router-dom'
import Reveal from './Reveal'

export default function CTABand() {
  return (
    <section className="section">
      <div className="container cta-band">
        <Reveal>
          <h2>Have a project in mind?</h2>
          <p>
            Tell us what you need — we will route it to the right division and
            respond with a clear next step.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Link to="/request-quote" className="btn btn-primary">
              Request a Quote
            </Link>
            <Link to="/enquiry" className="btn btn-soft">
              Make an Enquiry
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
