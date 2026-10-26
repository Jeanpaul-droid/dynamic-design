import { RevealText } from '../../components/ui/RevealText';
import { SERVICES } from '../../data/content';

export function Expertise() {
  return (
    <section className="section" id="expertise" aria-labelledby="expertise-title">
      <div className="section-inner">
        <div className="section-head section-head--anchor">
          <div className="eyebrow-row" data-reveal>
            <span className="eyebrow">Our expertise</span>
            <span className="rule" />
          </div>

          <RevealText
            text="What we do best."
            as="h2"
            id="expertise-title"
            className="h-display h2"
            accentWords={1}
            mode="scroll"
          />

          <p className="lede" data-reveal>
            Three disciplines, one team. We keep the loop between design and
            engineering short so ideas stay sharp all the way to launch.
          </p>

          <div
            className="scene-anchor scene-anchor--expertise"
            data-sculpture-anchor="expertise"
            aria-hidden="true"
          />
        </div>

        <div className="cards" data-reveal-group>
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <article className="card" key={service.index} data-reveal-item>
                <div className="card-top">
                  <span className="card-index">{service.index}</span>
                  <span className="card-icon">
                    <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </div>

                <div
                  className="card-stage"
                  data-expertise-anchor={index}
                  aria-hidden="true"
                />

                <h3 className="h-card">{service.title}</h3>
                <p className="card-desc">{service.description}</p>

                <div className="card-tags">
                  {service.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
