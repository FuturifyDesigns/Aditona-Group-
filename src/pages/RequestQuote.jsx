import EnquiryForm from '../components/EnquiryForm'
import PageHero from '../components/PageHero'
import ProgressiveArt from '../components/ProgressiveArt'
import EditableText from '../cms/EditableText'
import { heroes } from '../lib/images'

export default function RequestQuote() {
  return (
    <>
      <PageHero
        image={heroes.contact}
        eyebrow={
          <EditableText contentKey="quote.eyebrow" as="p" className="eyebrow">
            Quote
          </EditableText>
        }
        title={
          <EditableText contentKey="quote.hero_title" as="h1">
            Request a Quote
          </EditableText>
        }
        body={
          <EditableText contentKey="quote.hero_body" as="p" className="hero-lead" multiline>
            Share as much as you can about scope, timing, and budget. We will return a
            clear proposal from the right division.
          </EditableText>
        }
      />

      <section className="section has-art">
        <ProgressiveArt variant="blueprint" peak={0.48} />
        <div className="container" style={{ maxWidth: 720 }}>
          <EnquiryForm type="quote" />
        </div>
      </section>
    </>
  )
}
