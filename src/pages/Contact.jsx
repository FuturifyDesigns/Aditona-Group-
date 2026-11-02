import Reveal from '../components/Reveal'
import EnquiryForm from '../components/EnquiryForm'
import SplitHeadline from '../components/SplitHeadline'
import { config } from '../lib/config'

export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <SplitHeadline text="Let’s talk." as="h1" />
          <p>
            Reach the right inbox — or send a message and we will route it to the
            right division.
          </p>
        </div>
      </section>

      <section className="section">
        <div
          className="container"
          style={{
            display: 'grid',
            gap: '1.75rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'start',
          }}
        >
          <Reveal>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Details</h2>
            <p style={{ color: 'var(--ag-mid)', lineHeight: 1.8 }}>
              General:{' '}
              <a href={`mailto:${config.emails.info}`}>{config.emails.info}</a>
            </p>
            <p style={{ color: 'var(--ag-mid)', lineHeight: 1.8 }}>
              Enquiries:{' '}
              <a href={`mailto:${config.emails.enquiries}`}>
                {config.emails.enquiries}
              </a>
            </p>
            <p style={{ color: 'var(--ag-mid)', lineHeight: 1.8 }}>
              Operations:{' '}
              <a href={`mailto:${config.emails.operations}`}>
                {config.emails.operations}
              </a>
            </p>
            <p style={{ color: 'var(--ag-mid)', lineHeight: 1.8 }}>
              Accounts:{' '}
              <a href={`mailto:${config.emails.accounts}`}>
                {config.emails.accounts}
              </a>
            </p>
            <p style={{ color: 'var(--ag-mid)', lineHeight: 1.8, marginTop: '1rem' }}>
              Prefer WhatsApp? Use the green button — we respond during business hours.
            </p>
          </Reveal>

          <EnquiryForm type="contact" />
        </div>
      </section>
    </>
  )
}
