import { useCallback, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { NAV_ITEMS, STUDIO } from '../../data/studio';
import { Button } from '../ui/Button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => {
    document.body.style.overflow = '';
    setOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [closeMenu]);

  return (
    <>
      <header
        className={`nav-shell${scrolled || open ? ' is-scrolled' : ''}`}
        data-intro="nav"
      >
        <div className="nav-inner">
          <a className="wordmark" href="#home" aria-label="NOVA — home">
            NOVA<span>.</span>
          </a>

          <nav aria-label="Primary">
            <ul className="nav-links">
              {NAV_ITEMS.map((link) => (
                <li key={link.href}>
                  <a className="nav-link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-right">
            <Button href="#contact" className="nav-cta" withArrow>
              Let&rsquo;s talk
            </Button>

            <button
              className="burger"
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={toggleMenu}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <span className="nav-progress" data-progress aria-hidden="true" />
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="mobile-list">
            {NAV_ITEMS.map((link, index) => (
              <li key={link.href}>
                <a className="mobile-link" href={link.href} onClick={closeMenu}>
                  <i>0{index + 1}</i>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-foot">
          <Button href="#contact" onClick={closeMenu}>
            Let&rsquo;s talk
          </Button>
          <p className="mobile-contact">
            {STUDIO.email} &nbsp;·&nbsp; {STUDIO.phone}
          </p>
        </div>
      </div>
    </>
  );
}
