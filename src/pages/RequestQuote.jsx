import EnquiryForm from '../components/EnquiryForm'
import PageHero from '../components/PageHero'
import SplitHeadline from '../components/SplitHeadline'
import { heroes } from '../lib/images'

export default function RequestQuote() {
  return (
    <>
      <PageHero
        image={heroes.contact}
        eyebrow={<p className="eyebrow">Quote</p>}
        title={<SplitHeadline text="Request a Quote" as="h1" />}
        body={
          <p>
            Share as much as you can about scope, timing, and budget. We will return a
            clear proposal from the right division.
          </p>
        }
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <EnquiryForm type="quote" />
        </div>
      </section>
    </>
  )
}
