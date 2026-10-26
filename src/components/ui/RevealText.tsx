import type { ElementType, ReactNode } from 'react';

type RevealTextProps = {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  /** number of trailing words rendered in the accent colour */
  accentWords?: number;
  /** "load" plays in the intro timeline, "scroll" on ScrollTrigger */
  mode?: 'load' | 'scroll';
};

export function RevealText({
  text,
  as: asTag = 'h1',
  id,
  className = '',
  accentWords = 0,
  mode = 'scroll',
}: RevealTextProps) {
  const words = text.split(' ');
  const accentStart = accentWords > 0 ? words.length - accentWords : words.length;
  const Tag = asTag as 'h1';

  const children: ReactNode[] = [];
  words.forEach((word, index) => {
    const isAccent = index >= accentStart;
    children.push(
      <span className="word" data-word key={`${word}-${index}`}>
        {isAccent ? <em>{word}</em> : word}
      </span>,
    );
    if (index < words.length - 1) {
      children.push(<span key={`space-${index}`}> </span>);
    }
  });

  return (
    <Tag className={`split ${className}`} data-split={mode} id={id}>
      {children}
    </Tag>
  );
}
