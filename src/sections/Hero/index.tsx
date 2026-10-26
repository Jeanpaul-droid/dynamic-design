import { Button } from '../../components/ui/Button';
import { RevealText } from '../../components/ui/RevealText';
import { STUDIO } from '../../data/studio';

export function Hero() {
  return (
    <section className="hero section" id="home" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="hero-badge" data-intro="eyebrow">
            <b aria-hidden="true" />
            Creative Digital Studio
          </span>

          <RevealText
            text="We create digital experiences that feel alive."
            id="hero-title"
            className="h-display h-hero"
            accentWords={2}
            mode="load"
          />

          <p className="lede" data-intro="sub">
            We blend design, technology and imagination to create extraordinary
            digital experiences.
          </p>

          <div className="hero-actions" data-intro="actions">
            <Button href="#projects">Explore our work</Button>
            <Button href="#about" variant="ghost">
              About the studio
            </Button>
          </div>

          <div className="hero-meta" data-intro="sub">
            <span>Est. {STUDIO.founded}</span>
            <span aria-hidden="true">—</span>
            <span>Available for new projects</span>
          </div>
        </div>

        <div
          className="hero-visual"
          data-intro="visual"
          data-sculpture-anchor="hero"
          role="img"
          aria-label="Abstract glass sculpture, the signature object of the studio"
        />
      </div>

      <div className="scroll-cue" data-intro="cue" aria-hidden="true">
        <i />
        Scroll to explore
      </div>
    </section>
  );
}
