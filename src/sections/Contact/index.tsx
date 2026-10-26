import { Button } from '../../components/ui/Button';
import { RevealText } from '../../components/ui/RevealText';
import { STUDIO } from '../../data/studio';

export function Contact() {
  return (
    <section
      className="section contact-shell"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="section-inner">
        <div className="contact-grid">
          <div>
            <div className="eyebrow-row" data-reveal>
              <span className="eyebrow">Get in touch</span>
              <span className="rule" />
            </div>

            <RevealText
              text="Have an idea? Let's make it real."
              as="h2"
              id="contact-title"
              className="h-display h-contact"
              accentWords={3}
              mode="scroll"
            />
          </div>

          <div className="contact-side" data-reveal>
            <p className="lede">
              Tell us about your product, your timeline and your ambitions.
              We reply within two working days.
            </p>

            <Button href={`mailto:${STUDIO.email}`}>Start a project</Button>

            <div className="contact-details">
              <div>
                <span className="detail-label">Email</span>
                <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
              </div>
              <div>
                <span className="detail-label">Studio</span>
                <span>{STUDIO.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="scene-anchor scene-anchor--contact"
          data-sculpture-anchor="contact"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
