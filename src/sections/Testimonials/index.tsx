import { RevealText } from '../../components/ui/RevealText';
import { TESTIMONIALS } from '../../data/content';

export function Testimonials() {
  return (
    <section
      className="section"
      id="testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className="section-inner">
        <div className="section-head">
          <div className="eyebrow-row" data-reveal>
            <span className="eyebrow">Kind words</span>
            <span className="rule" />
          </div>

          <RevealText
            text="Teams who like to ship."
            as="h2"
            id="testimonials-title"
            className="h-display h2"
            accentWords={2}
            mode="scroll"
          />

          <p className="lede" data-reveal>
            We work best with teams that care about the details and move fast
            once the direction is clear.
          </p>
        </div>

        <p className="fiction-note" data-reveal>
          <span className="tag">Fictional demo</span>
          These quotes are invented for this demo and do not represent real
          clients.
        </p>

        <div className="quotes" data-reveal-group>
          {TESTIMONIALS.map((item) => (
            <figure className="quote" key={item.name} data-reveal-item>
              <span className="quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <span className="quote-name">{item.name}</span>
                <span className="quote-role">
                  {item.role} · {item.company}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
