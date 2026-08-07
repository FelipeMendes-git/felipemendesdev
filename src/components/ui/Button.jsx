import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const button = cva(
  [
    'relative inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap',
    'rounded-full border border-transparent font-semibold',
    'transition-[box-shadow,border-color,background-color,color] duration-300 ease-smooth',
    'group/btn',
  ],
  {
    variants: {
      variant: {
        cta: [
          'bg-accent text-accent-ink',
          'shadow-[0_12px_34px_-14px_var(--glow),inset_0_1px_0_rgb(255_255_255/18%)]',
          'hover:shadow-[0_20px_50px_-16px_var(--glow),inset_0_1px_0_rgb(255_255_255/24%)]',
        ],
        line: 'border-line text-ink hover:border-accent-line hover:bg-surface',
      },
      size: {
        md: 'px-7 py-[0.9375rem] text-[0.93rem]',
        sm: 'px-5 py-[0.6875rem] text-[0.87rem]',
      },
    },
    defaultVariants: { variant: 'cta', size: 'md' },
  },
);

/**
 * Renderiza <a> quando recebe href, <button> caso contrário.
 * A variante `cta` ganha um brilho que atravessa o botão no hover.
 */
export default function Button({ variant, size, className, children, href, ...rest }) {
  const Component = href ? 'a' : 'button';
  const external = href?.startsWith('http');

  return (
    <Component
      href={href}
      className={cn(button({ variant, size }), className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      {...(Component === 'button' ? { type: 'button' } : null)}
      {...rest}
    >
      {variant !== 'line' && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -translate-x-[130%]',
            'bg-[linear-gradient(115deg,transparent_24%,rgb(255_255_255/30%)_50%,transparent_76%)]',
            'transition-transform duration-1000 ease-smooth group-hover/btn:translate-x-[130%]',
          )}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </Component>
  );
}
