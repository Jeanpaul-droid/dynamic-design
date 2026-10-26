import { RevealText } from '../../components/ui/RevealText';
import { PROCESS_STEPS } from '../../data/content';

export function Process() {
  return (
    <section className="section" id="process" aria-labelledby="process-title">
      <div className="section-inner">
        <div className="section-head">
          <div className="eyebrow-row" data-reveal>
            <span className="eyebrow">How we work</span>
            <span className="rule" />
          </div>

          <RevealText
            text="Four steps, no surprises."
            as="h2"
            id="process-title"
            className="h-display h2"
            accentWords={2}
            mode="scroll"
          />

          <p className="lede" data-reveal>
            A short, visible loop from first workshop to launch day. You always
            know what is being built, why, and what happens next.
          </p>
        </div>

        <div className="process-grid">
          <div className="steps-wrap" data-process-steps>
            <span className="process-line" data-process-line aria-hidden="true" />
            <ol className="steps" data-reveal-group>
              {PROCESS_STEPS.map((step) => (
                <li className="step" key={step.index} data-reveal-item>
                  <span className="step-index">{step.index}</span>
                  <div className="step-body">
                    <h3 className="h-card">{step.title}</h3>
                    <p className="card-desc">{step.description}</p>
                    <span className="step-deliverable">{step.deliverable}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="process-side">
            <div
              className="scene-anchor scene-anchor--process"
              data-process-anchor
              aria-hidden="true"
            />
            <p className="lede" data-reveal>
              One team from kickoff to handover. Weekly demos, a shared board
              and a single point of contact — no relay race between agencies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
