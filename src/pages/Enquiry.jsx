import EnquiryForm from '../components/EnquiryForm'
import SplitHeadline from '../components/SplitHeadline'

export default function Enquiry() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Enquiry</p>
          <SplitHeadline text="Make an Enquiry" as="h1" />
          <p>
            Not ready for a full brief? Send a short enquiry and we will follow up with
            next steps.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <EnquiryForm type="enquiry" />
        </div>
      </section>
    </>
  )
}
