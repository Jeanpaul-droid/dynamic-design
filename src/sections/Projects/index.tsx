import { useState } from 'react';

import { CursorPreview } from '../../components/ui/CursorPreview';
import { RevealText } from '../../components/ui/RevealText';
import { PROJECTS } from '../../data/content';
import type { Project } from '../../types';

function ProjectArt() {
  return (
    <div className="project-art" data-parallax="26" aria-hidden="true">
      <span className="art-bar" />
      <span className="art-block art-block--a" />
      <span className="art-block art-block--b" />
      <span className="art-chip" />
      <span className="art-dot" />
    </div>
  );
}

export function Projects() {
  const [hovered, setHovered] = useState<Project | null>(null);

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="section-inner">
        <div className="section-head">
          <div className="eyebrow-row" data-reveal>
            <span className="eyebrow">Selected work</span>
            <span className="rule" />
          </div>

          <RevealText
            text="Work that earns attention."
            as="h2"
            id="projects-title"
            className="h-display h2"
            accentWords={2}
            mode="scroll"
          />

          <p className="lede" data-reveal>
            Four fictional case studies that show how we frame a problem,
            design the system and ship the front-end.
          </p>
        </div>

        <p className="fiction-note" data-reveal>
          <span className="tag">Fictional demo</span>
          Every project below is invented for this demo — the clients, metrics
          and outcomes are illustrative only.
        </p>

        <div className="projects-grid" data-reveal-group>
          {PROJECTS.map((project, index) => (
            <article
              className="project-card"
              key={project.id}
              data-reveal-item
              onPointerEnter={() => setHovered(project)}
              onPointerLeave={() => setHovered((current) => (current?.id === project.id ? null : current))}
            >
              <div className={`project-visual project-visual--${project.theme}`}>
                <ProjectArt />
                <span className="project-metric">
                  <b>{project.metric}</b>
                  {project.metricLabel}
                </span>
              </div>

              <div className="project-meta">
                <span className="project-index">0{index + 1}</span>
                <div>
                  <h3 className="h-card">{project.title}</h3>
                  <p className="project-category">
                    {project.category} · {project.year}
                  </p>
                </div>
              </div>

              <p className="card-desc">{project.summary}</p>

              <div className="card-tags">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <CursorPreview
          label={hovered ? `${hovered.metric} ${hovered.metricLabel}` : ''}
          active={hovered !== null}
        />
      </div>
    </section>
  );
}
