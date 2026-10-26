import { Suspense, lazy, useRef } from 'react';

import { useIntro } from '../animations/intro';
import { useScrollReveals } from '../animations/scroll';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Expertise } from '../sections/Expertise';
import { Hero } from '../sections/Hero';
import { Process } from '../sections/Process';
import { Projects } from '../sections/Projects';
import { Testimonials } from '../sections/Testimonials';

const GlobalCanvas = lazy(() =>
  import('../components/three/GlobalCanvas').then((module) => ({
    default: module.GlobalCanvas,
  })),
);

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIntro(rootRef);
  useScrollReveals(rootRef);

  return (
    <div ref={rootRef}>
      <Suspense fallback={null}>
        <GlobalCanvas />
      </Suspense>

      <Navbar />

      <main>
        <Hero />
        <About />
        <Expertise />
        <Projects />
        <Process />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
