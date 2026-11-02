import EnquiryForm from '../components/EnquiryForm'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import SplitHeadline from '../components/SplitHeadline'
import { heroes } from '../lib/images'

export default function Enquiry() {
  return (
    <>
      <PageHero
        image={heroes.contact}
        eyebrow={<p className="eyebrow">Enquiry</p>}
        title={<SplitHeadline text="Make an Enquiry" as="h1" />}
        body={
          <p className="hero-lead">
            Not ready for a full brief? Send a short enquiry and we will follow up with
            next steps.
          </p>
        }
      />

      <section className="section has-art">
        <ProgressiveArt variant="arcs" peak={0.48} />
        <div className="container" style={{ maxWidth: 720 }}>
          <EnquiryForm type="enquiry" />
        </div>
      </section>
    </>
  )
}
