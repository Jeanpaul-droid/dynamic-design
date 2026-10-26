import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'ghost';
  className?: string;
  withArrow?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  ariaLabel?: string;
};

export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  withArrow = true,
  onClick,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  const classes = `btn btn-${variant} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      {withArrow && (
        <span className="btn-arrow" aria-hidden="true">
          <ArrowUpRight size={17} strokeWidth={2} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href} aria-label={ariaLabel} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
