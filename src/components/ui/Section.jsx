import { cn } from '../../lib/cn';

export function Container({ className, children }) {
  return (
    <div className={cn('mx-auto w-full max-w-[71.25rem] px-[clamp(1.375rem,5vw,4rem)]', className)}>
      {children}
    </div>
  );
}

export function Section({ id, className, children, labelledBy }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative py-[clamp(4.75rem,10vw,8.25rem)]', className)}
    >
      {children}
    </section>
  );
}

/** Cabeçalho centralizado padrão: micro-label, título e apoio. */
export function SectionHeading({ eyebrow, title, children, id, className }) {
  return (
    <div
      className={cn(
        'mx-auto mb-[clamp(2.875rem,6vw,4.5rem)] flex max-w-[43.75rem] flex-col items-center gap-5 text-center',
        className,
      )}
    >
      {eyebrow && <span className="eyebrow text-faint">{eyebrow}</span>}
      <h2 id={id} className="text-[clamp(2rem,4.6vw,3.2rem)]">
        {title}
      </h2>
      {children && (
        <p className="m-0 max-w-[58ch] text-[clamp(1rem,1.9vw,1.12rem)] text-muted">{children}</p>
      )}
    </div>
  );
}
