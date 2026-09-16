import React from 'react';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export function SectionReveal({ children, className = '', delayMs = 0 }: SectionRevealProps) {
  return (
    <div
      className={`animate-section-reveal ${className}`}
      style={{
        animationDelay: delayMs > 0 ? `${delayMs}ms` : undefined,
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  );
}
