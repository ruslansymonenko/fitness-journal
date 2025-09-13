'use client';

import Link from 'next/link';
import type { ReactNode, MouseEventHandler } from 'react';

export type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'danger';
  disabled?: boolean;
};

const baseClasses =
  'inline-flex items-center gap-1 rounded-md text-sm px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[var(--brand-accent)] text-[var(--foreground)] hover:brightness-95 focus:ring-primary',
  secondary:
    'bg-[var(--brand-secondary)] text-[var(--foreground)] hover:brightness-95 focus:ring-secondary',
  danger: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors',
  ghost: 'bg-transparent text-[var(--foreground)] hover:bg-gray-100 focus:ring-gray-300',
  link: 'bg-transparent text-[var(--foreground)] hover:underline focus:ring-primary px-0 py-0',
};

export function Button({
  children,
  href,
  onClick,
  type = 'button',
  className = '',
  variant = 'primary',
  disabled,
}: ButtonProps) {
  const classes = `${baseClasses} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
