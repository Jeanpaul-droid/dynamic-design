import { ArrowUp } from 'lucide-react';

import { NAV_ITEMS, STUDIO } from '../../data/studio';

const SOCIALS = [
  { label: 'Instagram', href: '#contact' },
  { label: 'LinkedIn', href: '#contact' },
  { label: 'Dribbble', href: '#contact' },
  { label: 'Behance', href: '#contact' },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="wordmark" href="#home">
              NOVA<span>.</span>
            </a>
            <p className="footer-tagline">
              A creative digital studio building interfaces, products and brand
              experiences that feel alive.
            </p>
          </div>

          <ul className="footer-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>

          <ul className="footer-links">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a href={social.href}>{social.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NOVA — Creative Digital Studio</span>
          <span>{STUDIO.cities}</span>
          <span className="footer-note">
            Fictional demo studio. Projects and testimonials are illustrative.
          </span>
          <a className="to-top" href="#home">
            Back to top
            <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
