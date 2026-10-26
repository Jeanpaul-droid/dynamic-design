import { RevealText } from '../../components/ui/RevealText';
import { STATS } from '../../data/studio';

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="section-inner">
        <div className="eyebrow-row" data-reveal>
          <span className="eyebrow">About the studio</span>
          <span className="rule" />
        </div>

        <div className="about-grid">
          <div className="about-lead">
            <RevealText
              text="We turn bold ideas into digital reality."
              as="h2"
              id="about-title"
              className="h-display h-about"
              accentWords={2}
              mode="scroll"
            />

            <div
              className="scene-anchor"
              data-sculpture-anchor="about"
              aria-hidden="true"
            />
          </div>

          <div className="about-copy" data-reveal>
            <p className="lede">
              NOVA is an independent creative digital studio. We partner with
              ambitious teams to design and build websites, products and
              interactive stories where craft, motion and technology move in
              the same direction.
            </p>
            <p className="lede">
              From the first sketch to the final deployment, every pixel,
              transition and line of code is considered as part of one single
              experience — considered, fast, and unmistakably yours.
            </p>
          </div>
        </div>

        <div className="stats" data-reveal-group>
          {STATS.map((stat) => (
            <div key={stat.label} data-reveal-item>
              <div className="h-stat">
                <span data-count={String(stat.value)}>{stat.value}</span>
                <span className="accent">{stat.suffix}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
