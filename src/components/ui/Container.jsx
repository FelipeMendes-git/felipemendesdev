import { cn } from '../../lib/cn';

/** Largura máxima e respiro lateral padrão da página. */
export default function Container({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[96rem] px-[var(--gutter)]', className)} {...rest}>
      {children}
    </Tag>
  );
}
