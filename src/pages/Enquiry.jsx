import EnquiryForm from '../components/EnquiryForm'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import EditableText from '../cms/EditableText'
import { heroes } from '../lib/images'

export default function Enquiry() {
  return (
    <>
      <PageHero
        image={heroes.contact}
        eyebrow={
          <EditableText contentKey="enquiry.eyebrow" as="p" className="eyebrow">
            Enquiry
          </EditableText>
        }
        title={
          <EditableText contentKey="enquiry.hero_title" as="h1">
            Make an Enquiry
          </EditableText>
        }
        body={
          <EditableText contentKey="enquiry.hero_body" as="p" className="hero-lead" multiline>
            Not ready for a full brief? Send a short enquiry and we will follow up with
            next steps.
          </EditableText>
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
