import EditableButton from '../cms/EditableButton'
import EditableText from '../cms/EditableText'
import Reveal from './Reveal'

export default function CTABand() {
  return (
    <section className="section">
      <div className="container cta-band">
        <Reveal>
          <EditableText contentKey="cta.title" as="h2" />
          <EditableText contentKey="cta.body" as="p" multiline />
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <EditableButton
              to="/request-quote"
              contentKey="cta.quote"
              className="btn btn-primary"
            >
              Request a Quote
            </EditableButton>
            <EditableButton
              to="/enquiry"
              contentKey="cta.enquiry"
              className="btn btn-soft"
            >
              Make an Enquiry
            </EditableButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
