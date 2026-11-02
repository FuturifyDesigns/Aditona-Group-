import EnquiryForm from '../components/EnquiryForm'
import SplitHeadline from '../components/SplitHeadline'

export default function RequestQuote() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Quote</p>
          <SplitHeadline text="Request a Quote" as="h1" />
          <p>
            Share as much as you can about scope, timing, and budget. We will return a
            clear proposal from the right division.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <EnquiryForm type="quote" />
        </div>
      </section>
    </>
  )
}
